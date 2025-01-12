import { Patient } from '../types/patient';

interface Post {
  userId: number;
  id: number;
  title: string;
  body: string;
}

export const patientAdapter = {
  transformPostToPatient(post: Post): Patient {
    const seed = post.title.length;

    return {
      id: `P${post.id.toString().padStart(4, '0')}`,
      name: post.title.split(' ').slice(0, 2).join(' '), 
      age: 25 + (seed % 50),
      room: `${Math.floor(post.id / 4) + 1}${(post.id % 4) + 1}${post.id % 10}`,
      gender: post.id % 2 === 0 ? 'male' : 'female',
      vitals: {
        bloodPressure: `${110 + (seed % 40)}/${70 + (seed % 20)}`,
        heartRate: 60 + (seed % 40),
        oxygenLevel: 95 + (seed % 5)
      }
    };
  }
};
