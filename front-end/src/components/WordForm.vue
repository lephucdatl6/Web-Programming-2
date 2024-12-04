<template>
  <form action="#" @submit.prevent="onSubmit">
    <!-- <p v-if="errorsPresent" class="error">Please fill out three fields!</p> -->

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
      <button v-if="showImportButton" type="button" class="ui primary button" @click="triggerFileInput"> <i class="download icon"></i> Import </button>
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
    showImportButton: {
      type: Boolean,
      default: true, 
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
        alert('Please fill out all three fields!');
      } else {
        this.errorsPresent = false;
        this.$emit('createOrUpdate', this.word);
      }
    },
    // // Handles file input change (CSV file)
    async onFileChange(event) {
      const file = event.target.files[0]; // Get the selected file
      if (!file) return; // Return if no file was selected

      const text = await file.text(); // Read file text
      const rows = text.split('\n').filter(row => row.trim() !== ''); // Split into rows and remove empty lines
      const headerRemoved = rows.slice(1); // Remove header row

      // Track incomplete entries
      const incompleteEntries = [];

      // Process each row and map to word object with trimmed values
      const words = headerRemoved.map((row, index) => {
        const [english, german, russian] = row.split(',');
        const word = {
          english: english ? english.trim() : '',
          german: german ? german.trim() : '',
          russian: russian ? russian.trim() : '',
        };

        // Check for missing fields
        if (!word.english || !word.german || !word.russian) {
          incompleteEntries.push(`Row ${index + 2}`); // Add row number to list of incomplete entries
        }
        return word;
      }).filter(word => word.english || word.german || word.russian); // Filter out empty entries

      // If there are incomplete entries, show a warning
      if (incompleteEntries.length > 0) {
        alert(`Warning: Missing words detected in rows:\n[${incompleteEntries.join(', ')}]`);
        return; // skip confirmation if there are missing entries
      }

      const wordCount = words.length;

      // Ask for confirmation before importing if no missing data
      const userConfirmed = window.confirm(`You are about to import ${wordCount} complete words. Do you want to proceed?`);

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
