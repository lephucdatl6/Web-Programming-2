<template>
  <div>
    <h1>New Word</h1>
    <word-form @createOrUpdate="createOrUpdate" @importFile="importFile"></word-form>
  </div>
</template>

<script>
import WordForm from '../components/WordForm.vue';
import { api } from '../helpers/helpers';

export default {
  name: 'new-word',
  components: {
    'word-form': WordForm,
  },
  methods: {
    createOrUpdate: async function (word) {
      const res = await api.createWord(word);
      if (res && res._id) {
        this.flash('Word created', 'success');
        this.$router.push(`/words/${res._id}`);
      }
    },
    async importFile(words) {
      for (const word of words) {
        await api.createWord(word);
      }
      this.flash(`${words.length} words imported successfully!`, 'success');
    },
  },
};
</script>
