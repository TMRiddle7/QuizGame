<template>
    <main>
      <div class="container mt-2">
        <div class="row">
          <div class="col-12 text-center mb-3">
            <h2>LeaderBoard</h2>
          </div>
        </div>
        <div class="row">
          <div class="col-12">
            <table class="table">
              <thead>
                <tr>
                  <th scope="col">Rank</th>
                  <th scope="col">PlayerID</th>
                  <th scope="col">QuizID</th>
                  <th scope="col">Score</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(score, index) in scoreList" :key="index">
                  <th scope="row">{{ index + 1 }}</th>
                  <td>{{ score.PlayerID.S }}</td>
                  <td>{{ score.QuizID.S }}</td>
                  <td>{{ score.Correct.N }} / {{ score.Total.N }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  </template>
  
  <script>
  import { defineComponent, ref, onMounted } from 'vue';
  import { getScores } from '@/services/gameService';
  
  export default defineComponent({
    setup() {
      const scoreList = ref([]);
  
      const fetchScores = async () => {
        try {
          const scores = await getScores();
          scoreList.value = scores;
        } catch (error) {
          console.error('Error fetching scores:', error);
        }
      };
  
      onMounted(() => {
        fetchScores();
      });
  
      return {
        scoreList,
      };
    },
  });
  </script>
  