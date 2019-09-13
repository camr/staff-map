import fs from "fs";

const firebase = require("@firebase/testing");

/*
 * ============
 *    Setup
 * ============
 */
const projectId = "staff-map";
const firebasePort = require("../firebase.json").emulators.firestore.port;
const port = firebasePort /** Exists? */ ? firebasePort : 8080;
const coverageUrl = `http://localhost:${port}/emulator/v1/projects/${projectId}:ruleCoverage.html`;

const rules = fs.readFileSync("firestore.rules", "utf8");

function authedApp(auth?: object): any {
  return firebase.initializeTestApp({ projectId, auth }).firestore();
}

function adminApp(): any {
  return firebase.initializeAdminApp({ projectId }).firestore();
}

/*
 * ============
 *  Test Cases
 * ============
 */
describe("Firestore Rules", () => {
  beforeEach(async () => {
    // Clear the database between tests
    await firebase.clearFirestoreData({ projectId });
  });

  beforeAll(async () => {
    await firebase.loadFirestoreRules({ projectId, rules });
  });

  afterAll(async () => {
    await Promise.all(firebase.apps().map((app: any) => app.delete()));
    console.log(`View rule coverage information at ${coverageUrl}\n`);
  });

  describe("Users", () => {
    it("should be able to create accounts", async () => {
      const alice = authedApp({ uid: "alice" });
      await firebase.assertSucceeds(
        alice
          .collection("users")
          .doc("alice")
          .set({
            name: "Alice",
          })
      );
    });

    it("should only be able to create their own accounts", async () => {
      const alice = authedApp({ uid: "alice" });

      await firebase.assertFails(
        alice
          .collection("users")
          .doc("bob")
          .set({
            name: "Alice",
          })
      );
    });

    it("should be able to see other accounts", async () => {
      const alice = authedApp({ uid: "alice" });
      const anon = authedApp();
      const bob = authedApp({ uid: "bob" });

      await firebase.assertSucceeds(
        alice
          .collection("users")
          .doc("alice")
          .set({
            name: "Alice",
          })
      );

      await firebase.assertSucceeds(
        anon
          .collection("users")
          .doc("alice")
          .get()
      );

      await firebase.assertSucceeds(
        bob
          .collection("users")
          .doc("alice")
          .get()
      );
    });

    it("should be able to look up other accounts by email", async () => {
      const alice = authedApp({ uid: "alice" });
      const bob = authedApp({ uid: "bob" });

      await firebase.assertSucceeds(
        alice
          .collection("users")
          .doc("alice")
          .set({
            name: "Alice",
            email: "alice@example.com",
          })
      );

      await firebase.assertSucceeds(
        bob.collection("users").where("email", "==", "alice@example.com")
      );
    });
  });

  describe("Orgs", () => {
    beforeEach(async () => {
      const admin = adminApp();
      await admin
        .collection("orgs")
        .doc("org1")
        .set({
          managers: ["alice"],
        });
    });

    it("are visible to managers", async () => {
      const alice = authedApp({ uid: "alice" });

      await firebase.assertSucceeds(
        alice
          .collection("orgs")
          .doc("org1")
          .get()
      );
    });

    it("are not visible to non-managers", async () => {
      const bob = authedApp({ uid: "bob" });

      await firebase.assertFails(
        bob
          .collection("orgs")
          .doc("org1")
          .get()
      );
    });

    it("can get a list of managed orgs", async () => {
      const alice = authedApp({ uid: "alice" });

      await firebase.assertSucceeds(
        alice.collection("orgs").where("managers", "array-contains", "alice")
      );
    });
  });

  describe("Staff", () => {
    beforeEach(async () => {
      const admin = adminApp();
      await admin
        .collection("orgs")
        .doc("org1")
        .set({
          managers: ["alice"],
        });
    });

    it("may be created by org managers", async () => {
      const alice = authedApp({ uid: "alice" });

      await firebase.assertSucceeds(
        alice
          .collection("orgs")
          .doc("org1")
          .collection("staff")
          .add({
            name: "bob",
          })
      );
    });

    it("cannot be created by non-org managers", async () => {
      const bob = authedApp({ uid: "bob" });

      await firebase.assertFails(
        bob
          .collection("orgs")
          .doc("org1")
          .collection("staff")
          .add({
            name: "bob",
          })
      );
    });

    it("should not be visible to all users", async () => {
      const db = authedApp();
      await firebase.assertFails(
        db
          .collection("orgs")
          .doc("org1")
          .collection("staff")
          .get()
      );
    });

    it("should be visible to their managers", async () => {
      const db = authedApp({ uid: "alice" });

      await firebase.assertSucceeds(
        db
          .collection("orgs")
          .doc("org1")
          .collection("staff")
          .get()
      );
    });
  });
});
