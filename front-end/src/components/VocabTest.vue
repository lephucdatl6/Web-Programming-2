<template>
  <div>
    <h1>Test {{ testNumber }}/{{ this.words.length }}</h1>

    <h2>Score: {{ score }} out of {{ this.words.length }}</h2>

    <form action="#" @submit.prevent="onSubmit">

      <!-- Input field for English word -->
      <div class="ui labeled input fluid">
        <div class="ui label">
          <i class="united kingdom flag"></i> English
        </div>
        <!-- Show input as a test if 'english' is in testLanguages, else display the word -->        
        <input v-if="testLanguages.includes('english')" type="text" placeholder="Enter word..." v-model="english" :disabled="testOver" autocomplete="off" />
        <input v-else type="text" readonly :disabled="testOver" :value="currWord.english"/>
      </div>

      <!-- Input field for German word -->
      <div class="ui labeled input fluid">
        <div class="ui label">
          <i class="germany flag"></i> German
        </div>
        <!-- Show input as a test if 'german' is in testLanguages, else display the word -->        
        <input v-if="testLanguages.includes('german')" type="text" placeholder="Enter word..." v-model="german" :disabled="testOver" autocomplete="off" />
        <input v-else type="text" readonly :disabled="testOver" :value="currWord.german"/>
      </div>
      
      <!-- Input field for Russian word -->
      <div class="ui labeled input fluid">
        <div class="ui label">
          <i class="ru flag"></i> Russian
        </div>
        <!-- Show input as a test if 'russian' is in testLanguages, else display the word -->        
        <input v-if="testLanguages.includes('russian')" type="text" placeholder="Enter word..." v-model="russian" :disabled="testOver" autocomplete="off" />
        <input v-else type="text" readonly :disabled="testOver" :value="currWord.russian"/>
      </div>

      <!-- Submit button and Retry button-->
      <button class="positive ui button" :disabled="testOver"><i class="check icon"></i>Submit</button>
      <button v-if="testOver" class="ui button" @click="retry"><i class="redo icon"></i>Retry</button>
    </form>

    <!-- Display the result of the test -->
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
      randWords: [...this.words.sort(() => 0.5 - Math.random())], // Randomly shuffle the words list for the test
      incorrectGuesses: [],  // Store incorrect answers
      result: '', // Result message
      resultClass: '', // Class for result message
      english: '',  // English word input
      german: '', // German word input
      russian: '', // Russian word input
      score: 0, // Score initialized to 0
      testOver: false, // Flag to indicate if the test is over
      testLanguages: [], // Array to hold languages selected for the test
      testNumber: 1 // Start from test number 1
    };
  },
  computed: {
    // Get the current word for the test
    currWord() {
      return this.randWords.length ? this.randWords[0] : '';
    }
  },
  methods: {
    onSubmit() {
      const correct = this.testLanguages.every(lang => this[lang] === this.currWord[lang]);
      // Check if all answers are correct
      if (correct) {
        this.flash('Correct!', 'success', { timeout: 1000 });
        this.score += 1;
      } else {
        this.flash('Wrong!', 'error', { timeout: 1000 });
        // Store incorrect guesses
        this.incorrectGuesses.push({
          testNumber: this.testNumber,
          word: this.currWord,
          incorrectInputs: this.testLanguages.filter(lang => this[lang] !== this.currWord[lang])
        });
      }

      // Reset input fields after submitting      
      this.english = '';
      this.german = '';
      this.russian = '';
      this.randWords.shift();

      // If all words are tested, end the test
      if (this.randWords.length === 0) {
        this.testOver = true;
        this.displayResults();
      } else {
        this.testNumber += 1;
        this.randomizeLanguages();
      }
    },
    // Display the results after the test ends
    displayResults() {
      if (this.incorrectGuesses.length === 0) {
        this.result = 'You got everything correct. Well done!';
        this.resultClass = 'success';
      } else {
        // List the incorrect guesses with languages and words
        const incorrect = this.incorrectGuesses.map(guess => {
          const incorrectInputs = guess.incorrectInputs.map(lang => `${lang} [${guess.word[lang]}]`).join(', ');
          return `Test ${guess.testNumber} - ${incorrectInputs}`;
        }).join('<br>');
        this.result = `<strong>You got the following words wrong:</strong><br>${incorrect}`;
        this.resultClass = 'error';
      }
    },
    // Randomly select two languages for the test
    randomizeLanguages() {
      const languages = ['english', 'german', 'russian'];
      this.testLanguages = [];
      while (this.testLanguages.length < 2) {
        const randomLang = languages[Math.floor(Math.random() * languages.length)];
        if (!this.testLanguages.includes(randomLang)) {
          this.testLanguages.push(randomLang);
        }
      }
    },
    // Restart the test (When retry button is clicked)
    retry() {
      this.randWords = [...this.words.sort(() => 0.5 - Math.random())];
      this.incorrectGuesses = [];
      this.result = '';
      this.resultClass = '';
      this.english = '';
      this.german = '';
      this.russian = '';
      this.score = 0;
      this.testOver = false;
      this.testNumber = 1;
      this.randomizeLanguages();
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