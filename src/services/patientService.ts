import { Patient } from '../types/patient';
import { apiService } from './api';
import { patientAdapter } from './patientAdapter';

export const patientService = {
  async fetchPatients(): Promise<Patient[]> {
    try {
      const posts = await apiService.fetchPosts();
      console.log('Fetched posts:', posts);

      const patients = posts.slice(0, 10).map(post => {
        const patient = patientAdapter.transformPostToPatient(post);
        console.log(`Transformed post ${post.id} to patient:`, patient);
        return patient;
      });

      return patients;
    } catch (error) {
      console.error('Error in patient service:', error);
      throw error;
    }
  }
};
