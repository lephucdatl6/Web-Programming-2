<template>
  <div>
    <h2>Score: {{ score }} out of {{ this.words.length }}</h2>

    <form action="#" @submit.prevent="onSubmit">
      <div v-if="inputLanguages.includes('english')" class="ui labeled input fluid">
        <div class="ui label">
          <i class="united kingdom flag"></i> English
        </div>
        <input type="text" placeholder="Enter English word..." v-model="english" :disabled="testOver" autocomplete="off" />
      </div>

      <div v-if="inputLanguages.includes('german')" class="ui labeled input fluid">
        <div class="ui label">
          <i class="germany flag"></i> German
        </div>
        <input type="text" placeholder="Enter German word..." v-model="german" :disabled="testOver" autocomplete="off" />
      </div>

      <div v-if="inputLanguages.includes('russian')" class="ui labeled input fluid">
        <div class="ui label">
          <i class="ru flag"></i> Russian
        </div>
        <input type="text" placeholder="Enter Russian word..." v-model="russian" :disabled="testOver" autocomplete="off" />
      </div>

      <!-- Display Field for the Non-Selected Language -->
      <div class="ui labeled input fluid">
        <div class="ui label">
          <i :class="flagClass(displayLanguage)"></i> {{ capitalize(displayLanguage) }}
        </div>
        <input type="text" :value="currWord[displayLanguage]" readonly :disabled="testOver" />
      </div>

      <button class="positive ui button" :disabled="testOver">Submit</button>
    </form>

    <p :class="['results', resultClass]">
      <span v-html="result"></span>
    </p>
  </div>
</template>

<script>
export default {
  name: 'vocab-test',
  props: {
    words: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      randWords: [...this.words.sort(() => 0.5 - Math.random())],
      incorrectGuesses: [],
      result: '',
      resultClass: '',
      english: '',
      german: '',
      russian: '',
      score: 0,
      testOver: false,
      inputLanguages: [],
      displayLanguage: ''
    };
  },
  computed: {
    currWord() {
      return this.randWords.length ? this.randWords[0] : '';
    }
  },

  // Randomize the selection of two input languages and one display language each time it call
  methods: {
    shuffleLanguages() {
      const languages = ['english', 'german', 'russian'];
      const shuffled = languages.sort(() => 0.5 - Math.random());
      this.inputLanguages = shuffled.slice(0, 2);
      this.displayLanguage = shuffled[2];
    },
    onSubmit() {
      const correct = this.inputLanguages.every(
        (lang) => this[lang] === this.currWord[lang]
      );

      if (correct) {
        this.flash('Correct!', 'success', { timeout: 1000 });
        this.score += 1;
      } else {
        this.flash('Wrong!', 'error', { timeout: 1000 });
        this.incorrectGuesses.push(this.currWord[this.displayLanguage]);
      }

      this.english = '';
      this.german = '';
      this.russian = '';
      this.randWords.shift();

      this.shuffleLanguages();   // Shuffle languages for the next question

      if (this.randWords.length === 0) {
        this.testOver = true;
        this.displayResults();
      }
    },
    displayResults() {
      if (this.incorrectGuesses.length === 0) {
        this.result = 'You got everything correct. Well done!';
        this.resultClass = 'success';
      } else {
        const incorrect = this.incorrectGuesses.join(', ');
        this.result = `<strong>You got the following words wrong:</strong> ${incorrect}`;
        this.resultClass = 'error';
      }
    },

    // Dynamically show the flag icon
    flagClass(language) {
      return {
        english: 'united kingdom flag',
        german: 'germany flag',
        russian: 'ru flag'
      }[language];
    },
    capitalize(word) {
      return word.charAt(0).toUpperCase() + word.slice(1);
    }
  },

  // Calling shuffle on component Load
  mounted() {
    this.shuffleLanguages();
  }
};
</script>

<style scoped>
.results {
  margin: 25px auto;
  padding: 15px;
  border-radius: 5px;
}

.error {
  border: 1px solid #ebccd1;
  color: #a94442;
  background-color: #f2dede;
}

.success {
  border: 1px solid #d6e9c6;
  color: #3c763d;
  background-color: #dff0d8;
}
</style>
