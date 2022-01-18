"use strict";

const { dbConnection } = require("./db");
const { ObjectID } = require("mongodb");
const types = require("./types");

module.exports = {
  Query: {
    getCourses: async (root, { value }) => {
      let db;

      try {
        db = await dbConnection();

        if (value === null || value === "")
          return await db.collection("courses").find().toArray();

        return await db
          .collection("courses")
          .find({ $text: { $search: value } })
          .toArray();
      } catch (error) {
        console.error("Courses listing unsuccesfully", error);
      }
    },
    getCourse: async (root, { id }) => {
      let db;
      let course = {};

      try {
        db = await dbConnection();
        course = await db.collection("courses").findOne({ _id: ObjectID(id) });
      } catch (error) {
        console.error("Courses listing unsuccesfully", error);
      }

      return course;
    },
    getPersons: async () => {
      let db;
      let students = [];

      try {
        db = await dbConnection();
        students = await db.collection("students").find().toArray();
      } catch (error) {
        console.error("Students listing unsuccesfully", error);
      }

      return students;
    },
    getPerson: async (root, { id }) => {
      let db;
      let student = {};

      try {
        db = await dbConnection();
        student = await db
          .collection("students")
          .findOne({ _id: ObjectID(id) });
      } catch (error) {
        console.error("student obtain unsuccesfully", error);
      }

      return student;
    },
  },
  Mutation: {
    createCourse: async (root, { input }) => {
      try {
        let db = await dbConnection();

        let course = await db.collection("courses").insertOne(input);
        input._id = course.insertedId;
      } catch (error) {
        console.error("Error course created");
      }

      return input;
    },
    updateCourse: async (root, { id, input }) => {
      let course = {};
      try {
        let db = await dbConnection();

        await db
          .collection("courses")
          .updateOne({ _id: ObjectID(id) }, { $set: input });

        course = await db.collection("courses").findOne({ _id: ObjectID(id) });
      } catch (error) {
        console.error("Course update unsuccessful", error);
      }

      return course;
    },
    createCourseWithStudent: async (root, { courseId, studentId }) => {
      let course = {};
      let student = {};
      try {
        let db = await dbConnection();

        course = await db
          .collection("courses")
          .findOne({ _id: ObjectID(courseId) });
        if (!course) throw new Error("The course not exist");

        student = await db
          .collection("students")
          .findOne({ _id: ObjectID(studentId) });
        if (!student) throw new Error("The student not exist");

        await db
          .collection("courses")
          .updateOne(
            { _id: ObjectID(courseId) },
            { $addToSet: { students: studentId } }
          );
      } catch (error) {
        console.error("Error student created", error);
      }

      return course;
    },
    createPerson: async (root, { input }) => {
      try {
        let db = await dbConnection();

        let student = await db.collection("students").insertOne(input);
        input._id = student.insertedId;
      } catch (error) {
        console.error("Error student created");
      }

      return input;
    },
    updatePerson: async (root, { id, input }) => {
      let course = {};
      try {
        let db = await dbConnection();

        await db
          .collection("students")
          .updateOne({ _id: ObjectID(id) }, { $set: input });

        course = await db.collection("students").findOne({ _id: ObjectID(id) });
      } catch (error) {
        console.error("Course update unsuccessful", error);
      }

      return course;
    },
  },
  ...types,
};
