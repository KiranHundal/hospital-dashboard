import { Gender, Patient, VitalSigns } from "../types/patient";
import { Post } from "./api";
import { TransformationError, ValidationError } from "../types/errors";

export const patientAdapter = {
  transformPostToPatient(post: Post): Patient {
    try {
      const seed = post.title.length;
      const name = this.generatePatientName(post.title);
      const vitals = this.generateVitals(seed);

      return {
        id: this.generatePatientId(post.id),
        name,
        age: this.generateAge(seed),
        room: this.generateRoomNumber(post.id),
        gender: this.determineGender(post.id),
        vitals,

        fallRisk: Math.random() < 0.2,
        isolation: Math.random() < 0.1,
        npo: Math.random() < 0.15,
      };
    } catch (error) {
      throw new TransformationError(
        `Failed to transform post ${post.id} to patient`,
        { post, error }
      );
    }
  },

  generatePatientId(postId: number): string {
    return `P${postId.toString().padStart(4, "0")}`;
  },

  generatePatientName(title: string): string {
    const words = title.split(" ").slice(0, 2);
    if (words.length === 0) {
      throw new ValidationError("Invalid title: empty string");
    }
    return words.join(" ");
  },

  generateAge(seed: number): number {
    const age = 25 + (seed % 50);
    if (age < 0 || age > 120) {
      throw new ValidationError("Generated age out of valid range");
    }
    return age;
  },

  generateRoomNumber(postId: number): string {
    const floor = Math.floor(postId / 4) + 1;
    const room = (postId % 4) + 1;
    return `${floor}${room.toString().padStart(2, "0")}`;
  },

  determineGender(postId: number): Gender {
    return postId % 2 === 0 ? Gender.Male : Gender.Female;
  },

  generateVitals(seed: number): VitalSigns {
    const systolic = 110 + (seed % 40);
    const diastolic = 70 + (seed % 20);
    const heartRate = 60 + (seed % 40);
    const oxygenLevel = 95 + (seed % 5);

    if (systolic < 70 || systolic > 200) {
      throw new ValidationError("Invalid systolic pressure");
    }
    if (diastolic < 40 || diastolic > 130) {
      throw new ValidationError("Invalid diastolic pressure");
    }
    if (heartRate < 40 || heartRate > 200) {
      throw new ValidationError("Invalid heart rate");
    }
    if (oxygenLevel < 70 || oxygenLevel > 100) {
      throw new ValidationError("Invalid oxygen level");
    }
    return {
      bloodPressure: `${systolic}/${diastolic}`,
      heartRate,
      oxygenLevel,
      timestamp: Date.now(),
      isBPHigh: false,
      isBPLow: false,
      isHRHigh: false,
      isHRLow: false,
      isO2Low: false,
      severityScore:0,
    };

  },
};
