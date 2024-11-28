<template>
    <div>
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <h1>Words</h1>
            <div style="display: flex; gap: 10px;">
                <!-- Button to clear all words --> 
                <button @click="destroyAllData" class="ui negative button">
                    <i class="trash icon"></i> Clear All
                </button>

                <!-- Button to export words -->
                <button @click="exportWords" class="ui primary button">
                    <i class="upload icon"></i> Export
                </button>
            </div>
      </div>
      
      <!-- Table to display words in English, German, and Russian -->
      <table id="words" class="ui celled compact table">
        <thead>
          <tr>
            <th><i class="united kingdom flag"></i> English</th>
            <th><i class="de flag"></i> German</th>
            <th><i class="ru flag"></i> Russian</th>
            <th colspan="4"></th>
          </tr>
        </thead>
        <tr v-for="(word, i) in words" :key="i">
          <td>{{ word.english }}</td>
          <td>{{ word.german }}</td>
          <td>{{ word.russian }}</td>
          <td width="75" class="center aligned">
            <router-link :to="{ name: 'show', params: { id: word._id } }">
              <i class="eye icon"></i> Show
            </router-link>
          </td>
          <td width="75" class="center aligned">
            <router-link :to="{ name: 'edit', params: { id: word._id } }">
              <i class="edit icon"></i> Edit
            </router-link>
          </td>
          <td width="75" class="center aligned" @click.prevent="onDestroy(word._id)">
            <a :href="`words/${word._id}`">
              <i class="trash icon"></i> Destroy
            </a>
          </td>
        </tr>
      </table>
    </div>
  </template>
  
  <script>
  import router from '@/router';
  import { api } from '../helpers/helpers';
  
  export default {
    name: 'words',
    data() {
      return {
        words: []
      };
    },
    methods: {
      // Method to delete a specific word
      async onDestroy(id) {
        const sure = window.confirm('Are you sure?');
        if (!sure) return;
        await api.deleteWord(id);
        this.flash('Word deleted successfully!', 'success');
        this.words = this.words.filter(word => word._id !== id);
      },

      // Method to delete all words in the list
      async destroyAllData() {
        const sure = window.confirm('Are you sure you want to delete ALL words?');
        if (!sure) return;
  
        // Delete each word through the API
        for (const word of this.words) {
          await api.deleteWord(word._id);
        }

        // Clear the words array and show a success message
        this.words = [];
        this.flash('All words deleted successfully!', 'success');
      },

      // Method to export all words as a CSV file
      exportWords() {
        const csvContent = [
          // Header row for the CSV
          ['English', 'German', 'Russian'],
          // Data rows for each word
          ...this.words.map(word => [word.english, word.german, word.russian])
        ]
          .map(row => row.join(',')) // Join each row with a comma
          .join('\n'); // Join all rows with a newline
  
        // Create a Blob object with the CSV content
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob); // Create a downloadable object URL
        link.download = 'words.csv'; // Set the download filename
        link.click(); // Trigger the download
      }
    },
    // Fetch words from the API on component mount
    async mounted() {
      this.words = await api.getWords();
    }
  };
  </script>
  