<template>
    <div>
        <h1>Words</h1>
        <table id="words" class="ui celled compact table">
            <thead>
                <tr>
                    <th><i class="united kingdom flag"></i> English</th>
                    <th><i class="de flag"></i>German</th>
                    <th><i class="ru flag"></i>Russian</th>
                    <th colspan="4"></th>
                </tr>
            </thead>
            <tr v-for="(word, i) in this.words" :key="i">
                <td>{{ word.english }}</td>
                <td> {{ word.german }}</td>
                <td> {{ word.russian }}</td>
                <td width="75" class="center aligned">
                <router-link :to="{name: 'show', params: {id: word._id}}"><i class="eye icon"></i>Show</router-link></td>
                <td width="75" class="center aligned">
                <router-link :to="{name: 'edit', params: {id: word._id}}"><i class="edit icon"></i>Edit</router-link></td>
                <td width="75" class="center aligned" @click.prevent="onDestroy(word._id)">
                <a :href="`words/${word._id}`"><i class="trash icon"></i>Destroy</a></td>
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
        async onDestroy(id) {
            const sure = window.confirm('Are you sure?');
            if (!sure) return;
            await api.deleteWord(id);
            this.flash('Word deleted sucessfully!', 'success');
            const newWords = this.words.filter(word => word._id !== id);
            this.words = newWords;
        }
    },
    async mounted() {
        this.words = await api.getWords();
    }
};
</script>