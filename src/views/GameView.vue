<template>
  <main>
    <top-ribbon></top-ribbon>
    <div class="container-fluid d-flex justify-content-center align-items-center">
      <div>
        <!-- Render the quiz buttons only if no quiz is selected -->
        <div v-if="!selectedQuizID" class="d-flex flex-column align-items-center">
          <h1 class="text-center">Quiz Board</h1>
          <div v-if="quizzes">
            <div v-for="quiz in quizzes" :key="quiz.QuizID" class="mt-2 mb-2">
              <button class="btn btn-outline-dark" @click="selectQuiz(quiz.QuizID)">
                {{ quiz.category }}
              </button>
            </div>
          </div>
          <p v-else>Loading quizzes...</p>
        </div>

        <!-- Include QuizBoard.vue when a quiz is selected -->
        <QuizBoard class="quizboarddiv vh-75 vw-100 mx-auto" v-if="selectedQuizID" :quizID="selectedQuizID" @back="deselectQuiz" />
      </div>
    </div>

    <footer-comp></footer-comp>
  </main>
</template>

<script>
import { onMounted, ref } from 'vue';
import { defineComponent } from 'vue';
import { getQuizzes } from '@/services/gameService';
import QuizBoard from '@/components/QuizBoard.vue';
import TopRibbon from '@/components/TopRibbon.vue';
import FooterComp from '@/components/FooterComp.vue';

export default defineComponent({
  name: 'GameView',
  components: {
    QuizBoard,
    TopRibbon,
    FooterComp,
  },
  setup() {
    const quizzes = ref([]);
    const selectedQuizID = ref(null);

    const fetchQuizzes = async () => {
      try {
        quizzes.value = await getQuizzes();
      } catch (error) {
        console.error('Failed to load quizzes:', error);
      }
    };

    const selectQuiz = (quizId) => {
      selectedQuizID.value = quizId;
    };

    const deselectQuiz = () => {
      selectedQuizID.value = null;
    };

    const checkConnect = () =>{
      console.log('Connecting to WebSocket');

    }

    onMounted(() => {
      fetchQuizzes();
    });

    return {
      quizzes,
      selectedQuizID,
      selectQuiz,
      deselectQuiz,
    };
  },
});
</script>

<style scoped>
  
</style>