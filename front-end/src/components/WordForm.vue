<template>
  <form action="#" @submit.prevent="onSubmit">
    <p v-if="errorsPresent" class="error">Please fill out three fields!</p>

    <!-- Input field for English word -->
    <div class="ui labeled input fluid">
      <div class="ui label">
        <i class="united kingdom flag"></i> English
      </div>
      <input type="text" placeholder="Enter word..." v-model="word.english" />
    </div>

    <!-- Input field for German word -->
    <div class="ui labeled input fluid">
      <div class="ui label">
        <i class="germany flag"></i> German
      </div>
      <input type="text" placeholder="Enter word..." v-model="word.german" />
    </div>

    <!-- Input field for Russian word -->
    <div class="ui labeled input fluid">
      <div class="ui label">
        <i class="ru flag"></i> Russian
      </div>
      <input type="text" placeholder="Enter word..." v-model="word.russian" />
    </div>

    <!-- Submit and import buttons -->
    <div class="form-buttons">
      <!-- Submit button -->
      <button class="positive ui button" type="submit"><i class="check icon"></i> Submit</button>
      <!-- Import Button -->
      <button type="button" class="ui primary button" @click="triggerFileInput"> <i class="download icon"></i> Import </button>
      <!-- Hidden file input for CSV file import -->
      <input type="file" ref="fileInput" @change="onFileChange" style="display: none;" accept=".csv"/>
    </div>
  </form>
</template>

<script>
export default {
  name: 'word-form',
  props: {
    word: {
      type: Object,
      required: false,
      default: () => ({
        english: '',
        german: '',
        russian: '',
      }),
    },
  },
  data() {
    return {
      errorsPresent: false,
    };
  },
  methods: {
    // Handles form submission
    onSubmit() {
      // Check required fields are empty
      if (
        this.word.english === '' ||
        this.word.german === '' ||
        this.word.russian === ''
      ) {
        this.errorsPresent = true;
      } else {
        // Emit event with word data if all fields are filled
        this.$emit('createOrUpdate', this.word);
      }
    },
    // Handles file input change (CSV file)
    async onFileChange(event) {
      const file = event.target.files[0]; // Get the selected file
      if (!file) return; // Return if no file was selected

      const text = await file.text(); // Read file text
      const rows = text.split('\n').filter(row => row.trim() !== ''); // Split into rows and remove empty lines
      const headerRemoved = rows.slice(1); // Remove header row

      // Process each row and map to word object with trimmed values
      const words = headerRemoved.map((row) => {
        const [english, german, russian] = row.split(',');
        return {
          english: english ? english.trim() : '',
          german: german ? german.trim() : '',
          russian: russian ? russian.trim() : '',
        };
      }).filter(word => word.english || word.german || word.russian);  // Filter out incomplete word entries

      const wordCount = words.length;

      // Ask for confirmation before importing
      const userConfirmed = window.confirm(`You are about to import ${wordCount} words. Do you want to proceed?`);

      if (userConfirmed) {
        this.$emit('importFile', words);
      } else {
        this.flash('Import canceled.', 'warning');
      }
    },
    // Triggers file input click
    triggerFileInput() {
      this.$refs.fileInput.click();
    },
  },
};
</script>

<style scoped>
.form-buttons {
  display: flex;
  justify-content: space-between;
  margin-top: 1rem;
}
</style>
