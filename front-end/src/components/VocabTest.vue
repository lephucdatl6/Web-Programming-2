<template>
  <div>
    <h1>Test {{ testNumber }}</h1>

    <h2>Score: {{ score }} out of {{ this.words.length }}</h2>

    <form action="#" @submit.prevent="onSubmit">
      <div class="ui labeled input fluid">
        <div class="ui label">
          <i class="united kingdom flag"></i> English
        </div>
        <input v-if="testLanguages.includes('english')" type="text" placeholder="Enter word..." v-model="english" :disabled="testOver" autocomplete="off" />
        <input v-else type="text" readonly :disabled="testOver" :value="currWord.english"/>
      </div>

      <div class="ui labeled input fluid">
        <div class="ui label">
          <i class="germany flag"></i> German
        </div>
        <input v-if="testLanguages.includes('german')" type="text" placeholder="Enter word..." v-model="german" :disabled="testOver" autocomplete="off" />
        <input v-else type="text" readonly :disabled="testOver" :value="currWord.german"/>
      </div>
      
      <div class="ui labeled input fluid">
        <div class="ui label">
          <i class="ru flag"></i> Russian
        </div>
        <input v-if="testLanguages.includes('russian')" type="text" placeholder="Enter word..." v-model="russian" :disabled="testOver" autocomplete="off" />
        <input v-else type="text" readonly :disabled="testOver" :value="currWord.russian"/>
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
      testLanguages: [],
      testNumber: 1
    };
  },
  computed: {
    currWord() {
      return this.randWords.length ? this.randWords[0] : '';
    }
  },
  methods: {
    onSubmit() {
      const correct = this.testLanguages.every(lang => this[lang] === this.currWord[lang]);
      if (correct) {
        this.flash('Correct!', 'success', { timeout: 1000 });
        this.score += 1;
      } else {
        this.flash('Wrong!', 'error', { timeout: 1000 });
        this.incorrectGuesses.push({
          testNumber: this.testNumber,
          word: this.currWord,
          incorrectInputs: this.testLanguages.filter(lang => this[lang] !== this.currWord[lang])
        });
      }

      this.english = '';
      this.german = '';
      this.russian = '';
      this.randWords.shift();

      if (this.randWords.length === 0) {
        this.testOver = true;
        this.displayResults();
      } else {
        this.testNumber += 1;
        this.randomizeLanguages();
      }
    },
    displayResults() {
      if (this.incorrectGuesses.length === 0) {
        this.result = 'You got everything correct. Well done!';
        this.resultClass = 'success';
      } else {
        const incorrect = this.incorrectGuesses.map(guess => {
          const incorrectInputs = guess.incorrectInputs.map(lang => `${lang}: ${guess.word[lang]}`).join(' & ');
          return `Test ${guess.testNumber}: ${incorrectInputs}`;
        }).join('<br>');
        this.result = `<strong>You got the following words wrong:</strong><br>${incorrect}`;
        this.resultClass = 'error';
      }
      this.testNumber = 1;
    },
    randomizeLanguages() {
      const languages = ['english', 'german', 'russian'];
      this.testLanguages = [];
      while (this.testLanguages.length < 2) {
        const randomLang = languages[Math.floor(Math.random() * languages.length)];
        if (!this.testLanguages.includes(randomLang)) {
          this.testLanguages.push(randomLang);
        }
      }
    }
  },
  mounted() {
    this.randomizeLanguages();
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