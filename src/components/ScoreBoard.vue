<template>
  <div class="scoreboard p-3 rounded text-white bg-dark">
    <h5><i class="bi bi-clipboard-check"></i> Scoreboard</h5>
    <p>Total Questions: {{ questions }}</p>
    <p>Answered: {{ answered }}</p>
    <p>Remaining: {{ questions - answered }}</p>
    <p>Correct: {{ correctAns }} </p>
    <p>Wrong: {{ wrongAns }} </p>
  </div>
</template>

<script>
export default {
  props: {
    questions: {
      type: Number,
      required: true,
    },
    answered: {
      type: Number,
      required: true,
    },
    correctAns: {
      type: Number,
      required: true,
    },
    wrongAns: {
      type: Number,
      required: true,
    },
  },
};
</script>

<style scoped>
.scoreboard {
  width: 200px;
  font-size: 0.9rem;
  text-align: left;
}
</style>
