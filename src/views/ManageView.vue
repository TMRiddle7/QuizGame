<template>
  <top-ribbon></top-ribbon>
  <div class="container mt-4">
    <h1>Create Custom Quiz</h1>
    <form @submit.prevent="handleSubmit" class="mt-4">
      <div class="mb-3">
        <label for="quizID" class="form-label">Quiz ID</label>
        <input type="text" id="quizID" class="form-control" :value="quizID" readonly>
      </div>
      
      <div class="mb-3">
        <label for="category" class="form-label">Quiz Name</label>
        <input type="text" id="category" v-model="category" class="form-control" maxlength="20" required>
      </div>
      
      <div v-for="(question, index) in questions" :key="index" class="mb-4 border p-3 rounded">
        <h5>Question {{ index + 1 }}</h5>
        
        <div class="mb-3">
          <label for="questionText-{{ index }}" class="form-label">Question</label>
          <input type="text" :id="'questionText-' + index" v-model="question[0]" class="form-control" required>
        </div>

        <div class="mb-3">
          <label for="imageFile-{{ index }}" class="form-label">Image (optional)</label>
          <input type="file" :id="'imageFile-' + index" @change="handleFileChange($event, index)" accept="image/jpeg, image/png">
          <button type="button" @click="uploadFile(index)" class="btn btn-outline-primary mt-2">Upload Image</button>
          <div v-if="uploadedImages[index]" class="mt-2">
            <img :src="uploadedImages[index]" alt="Uploaded Image" style="max-width: 200px;">
          </div>
        </div>
        
        <div class="mb-3">
          <label for="imageURL-{{ index }}" class="form-label">Image URL (optional)</label>
          <input type="text" :id="'imageURL-' + index" v-model="question[1]" class="form-control" readonly>
        </div>
        
        <div class="mb-3">
          <label class="form-label">Options</label>
          <div class="row">
            <div class="col-md-6">
              <input type="text" :id="'option1-' + index" v-model="question[2]" class="form-control mb-2" placeholder="Option 1" required>
              <input type="text" :id="'option2-' + index" v-model="question[3]" class="form-control mb-2" placeholder="Option 2" required>
            </div>
            <div class="col-md-6">
              <input type="text" :id="'option3-' + index" v-model="question[4]" class="form-control mb-2" placeholder="Option 3" required>
              <input type="text" :id="'option4-' + index" v-model="question[5]" class="form-control mb-2" placeholder="Option 4" required>
            </div>
          </div>
        </div>
        
        <div class="mb-3">
          <label for="correctOption-{{ index }}" class="form-label">Correct Option</label>
          <input type="text" :id="'correctOption-' + index" v-model="question[6]" class="form-control" required>
        </div>
      </div>

      <button type="button" @click="addQuestion" class="btn btn-outline-primary mr-3">Add Question</button>
      <button type="submit" class="btn btn-success ml-3">Submit</button>
    </form>
    <footer-comp></footer-comp>
  </div>
</template>

<script>
import { uploadToS3 } from '@/services/s3Service';
import { addNewQuiz } from '@/services/gameService';
import TopRibbon from '@/components/TopRibbon.vue';
import FooterComp from '@/components/FooterComp.vue';
export default {
  components: {
    TopRibbon,
    FooterComp,
  },
  data() {
    return {
      quizID: this.generateQuizID(),
      category: '',
      questions: [
        ['', '', '', '', '', '', '']  // Default question format
      ],
      uploadedImages: []  // To store URLs of uploaded images
    };
  },
  methods: {
    generateQuizID() {
      const date = new Date();
      const yyyymmdd = date.toISOString().slice(0, 10).replace(/-/g, '');
      const randomNumbers = Math.floor(1000 + Math.random() * 9000);
      return `Quiz${yyyymmdd}${randomNumbers}`;
    },
    addQuestion() {
      this.questions.push(['', '', '', '', '', '', '']);
      this.uploadedImages.push(null);  // Add placeholder for image URL
    },
    handleFileChange(event, index) {
      const file = event.target.files[0];
      if (file) {
        if (!['image/jpeg', 'image/png'].includes(file.type)) {
          alert('Please upload a JPEG or PNG image.');
          return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
          // Store file as Base64 string in sessionStorage
          sessionStorage.setItem(`imageFile-${index}`, reader.result);
          this.uploadedImages[index] = reader.result;
        };
        reader.readAsDataURL(file);
      }
    },
    async uploadFile(index) {
      const base64File = sessionStorage.getItem(`imageFile-${index}`);
      if (!base64File) {
        alert('No file selected.');
        return;
      }

      try {
        const response = await fetch(base64File);
        const fileBlob = await response.blob();
        const fileName = `${this.quizID}/${Date.now()}_${this.extractFileName(base64File)}`;
        const s3Url = await uploadToS3(fileBlob, fileName);

        // Update the image URL in the form
        this.questions[index][1] = s3Url;
        sessionStorage.removeItem(`imageFile-${index}`);  // Clear session storage
      } catch (error) {
        console.error('Error uploading file:', error);
        alert('Failed to upload image.');
      }
    },
    extractFileName(base64String) {
      // Extract file name from Base64 string if possible, or generate a unique name
      // This is a placeholder function, you may need to modify this based on your needs
      return 'image.png'; // Default or extracted name if possible
    },
    async handleSubmit() {
      try {
        await this.addQuiz();
        // Reset the form fields after successful submission
        this.quizID = this.generateQuizID();
        this.category = '';
        this.questions = [['', '', '', '', '', '', '']];  // Reset questions array
      } catch (error) {
        console.error('Error submitting form:', error);
        alert('Form submission failed.');
      }
    },
    async addQuiz() {
      try {
        const result = await addNewQuiz(this.quizID, this.category, this.questions);
        console.log('Quiz added successfully:', result);
      } catch (error) {
        console.error('Error adding quiz:', error);
      }
    }
  }
}
</script>

<style scoped>
/* Add any custom styles here */
</style>