<template>
  <form action="#" @submit.prevent="onSubmit">
    <p v-if="errorsPresent" class="error">Please fill out three fields!</p>

    <div class="ui labeled input fluid">
      <div class="ui label">
        <i class="united kingdom flag"></i> English
      </div>
      <input type="text" placeholder="Enter word..." v-model="word.english" />
    </div>

    <div class="ui labeled input fluid">
      <div class="ui label">
        <i class="germany flag"></i> German
      </div>
      <input type="text" placeholder="Enter word..." v-model="word.german" />
    </div>

    <div class="ui labeled input fluid">
      <div class="ui label">
        <i class="ru flag"></i> Russian
      </div>
      <input type="text" placeholder="Enter word..." v-model="word.russian" />
    </div>

    <div class="form-buttons">
      <button class="positive ui button" type="submit">Submit</button>
      <button type="button" class="ui primary button" @click="triggerFileInput"> <i class="download icon"></i> Import </button>
      <input type="file" ref="fileInput" @change="onFileChange" style="display: none;"/>
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
    onSubmit() {
      if (
        this.word.english === '' ||
        this.word.german === '' ||
        this.word.russian === ''
      ) {
        this.errorsPresent = true;
      } else {
        this.$emit('createOrUpdate', this.word);
      }
    },
    async onFileChange(event) {
      const file = event.target.files[0];
      if (!file) return;

      const text = await file.text();
      const rows = text.split('\n').filter(row => row.trim() !== '');
      const headerRemoved = rows.slice(1);

      const words = headerRemoved.map((row) => {
        const [english, german, russian] = row.split(',');
        return {
          english: english ? english.trim() : '',
          german: german ? german.trim() : '',
          russian: russian ? russian.trim() : '',
        };
      }).filter(word => word.english || word.german || word.russian);

      const wordCount = words.length;

      const userConfirmed = window.confirm(`You are about to import ${wordCount} words. Do you want to proceed?`);

      if (userConfirmed) {
        this.$emit('importFile', words);
      } else {
        this.flash('Import canceled.', 'warning');
      }
    },
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
