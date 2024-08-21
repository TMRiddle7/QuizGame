<template>
  <div class="quiz-board-container d-flex flex-column justify-content-center align-items-center position-relative">
    
    <!-- Loading Screen -->
    <div v-if="loading" class="loading-screen d-flex justify-content-center align-items-center">
      <div class="spinner-border text-light" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>

    <!-- Quiz Content -->
    <div v-else class="container-fluid h-100">
      <div v-if="currentQuestionIndex < questions.length" class="w-75">
        <div class="mb-4">
          <h4>{{ currentQuestion[0].S }}</h4>
        </div>

        <!-- Display Image if present -->
        <div v-if="currentQuestion[1]?.S !== 'null'" class="mb-4">
          <img :src="currentQuestion[1].S" alt="Question Image" width="128px" height="93px" class="img-fluid"/>
        </div>

        <form @submit.prevent="submitAnswer">
          <div v-for="(option, index) in currentQuestion.slice(2, 6)" :key="index" class="form-check mb-2">
            <input 
              class="form-check-input" 
              type="radio" 
              :id="'option' + index" 
              :value="option.S" 
              v-model="selectedAnswer" 
              required
            />
            <label class="form-check-label" :for="'option' + index">
              {{ option.S }}
            </label>
          </div>
          <button v-if="!ansSubmitted" type="submit" class="btn btn-outline-light mt-3">
            <i class="bi bi-check-circle"></i> Submit
          </button>

          <!-- Feedback after answer submission -->
          <div v-if="answerFeedback !== null" class="mt-4">
            <p :class="{'text-success': answerFeedback, 'text-danger': !answerFeedback, 'flash': true}">
              <i :class="{'bi bi-check-circle': answerFeedback, 'bi bi-x-circle': !answerFeedback}"></i>
              {{ answerFeedback ? 'Correct!' : 'Incorrect!' }}
            </p>
          </div>

          <!-- Warning Message -->
          <div v-if="warningMessage && answerFeedback === null" class="text-danger mt-2">
            {{ warningMessage }}
          </div>
        </form>

        <!-- Next button -->
        <button  v-if="answerFeedback !== null"  class="btn btn-outline-light mt-3" @click="nextQuestion">
          <i class="bi bi-arrow-right-circle"></i> Next
        </button>
      </div>

      <!-- Quiz Completion -->
      <div v-else class="w-75">
        <h4>Congratulations! Quiz Completed!</h4>
        <div> 
          <h4>Score: {{ correctAns }}/{{ questions.length }}</h4>
        </div>
        <button class="btn btn-outline-light mt-3" @click="finishQuiz">
          <i class="bi bi-arrow-left-circle"></i> Finish
        </button>
      </div>

      <!-- Go Back Button -->
      <button v-if="!questions.length" class="btn btn-outline-light mt-4" @click="goBack">
        <i class="bi bi-arrow-left-circle"></i> Go Back
      </button>

      
    </div>
    <!-- Include ScoreBoard.vue in the right corner -->
    <ScoreBoard 
        :questions="questions.length" 
        :answered="answered" 
        :correctAns="correctAns" 
        :wrongAns="wrongAns" 
        class="position-absolute top-0 end-0 m-3"/>
    <p class="Note"><strong>DO Not switch screen or go back, Quiz will not be submitted</strong></p>
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue';
import { getQues, submitScore } from '@/services/gameService';
import ScoreBoard from '@/components/ScoreBoard.vue';

export default {
  props: {
    quizID: {
      type: String,
      required: true,
    },
  },
  components: {
    ScoreBoard,
  },
  emits: ['back'],
  setup(props, { emit }) {
    const questions = ref([]);
    const currentQuestionIndex = ref(0);
    const selectedAnswer = ref(null);
    const answerFeedback = ref(null);
    const loading = ref(true);
    const warningMessage = ref(null);
    const ansSubmitted = ref(false);
    const correctAns = ref(0);
    const wrongAns = ref(0);
    const answered = ref(0);
    const subScore = ref(false);
    const currentQuestion = computed(() => questions.value[currentQuestionIndex.value]?.L || []);

    const fetchQuestions = async () => {
      try {
        const response = await getQues(props.quizID);
        questions.value = response.Questions.L;
      } catch (error) {
        console.error('Error in fetching questions:', error);
      } finally {
        loading.value = false;
      }
    };

    const submitAnswer = () => {
      if (!selectedAnswer.value) {
        warningMessage.value = 'Please select one option to submit.';
        return;
      }
      ansSubmitted.value = true;
      answered.value++;
      const correctAnswer = currentQuestion.value[6]?.S;
      answerFeedback.value = selectedAnswer.value === correctAnswer;
      if (answerFeedback.value) {
        correctAns.value++;
      } else {
        wrongAns.value++;
      }
    };

    const nextQuestion = () => {
      selectedAnswer.value = null;
      answerFeedback.value = null;
      ansSubmitted.value = false;
      currentQuestionIndex.value++;
    };

    const submit_Score = async() =>{
      subScore.value = true;
      await submitScore(props.quizID, correctAns.value, questions.value.length);
    };

    const finishQuiz = () => {
      setTimeout(1000);
      submit_Score();
      emit('back');
    };

    onMounted(() => {
      fetchQuestions();
    });

    return {
      currentQuestionIndex,
      questions,
      selectedAnswer,
      answerFeedback,
      loading,
      warningMessage,
      ansSubmitted,
      answered,
      correctAns,
      wrongAns,
      currentQuestion,
      submitAnswer,
      nextQuestion,
      finishQuiz,
    };
  },
};
</script>

<style scoped>
.quiz-board-container {
  margin: 0;
  background-color: #343a40;
  color: white;
  width: 80%;
  height: 82.5vh;
  padding: 2rem;
  text-align: center;
  border-radius: 0px;
  position: absolute;
  top: 0px;
  
}

.flash {
  animation: flash 1s ease-in-out;
}

@keyframes flash {
  0% { opacity: 0; }
  50% { opacity: 1; }
  100% { opacity: 0; }
}

h4 {
  font-weight: bold;
}

.form-check-label {
  font-size: 1.2rem;
}

.text-success {
  color: #28a745;
}

.text-danger {
  color: #dc3545;
}

.loading-screen {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.8);
  color: white;
  z-index: 1000;
}

.img-fluid {
  max-width: 100%;
  height: auto;
  border-radius: 10px;
}

.Note{
  font-size: xx-small;
  color:white;
  opacity: 0.7;
  position: absolute;
  bottom: 0;
}
</style>
