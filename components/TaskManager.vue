<template>
  <div class="task-manager">
    <div v-if="tasks.length > 0">
      <h2>Tasks</h2>
      <ul>
        <li v-for="(task, index) in tasks" :key="index">
          <span>{{ task.name }}</span>
          <button @click="toggleTaskStatus(task)">{{ task.completed ? 'Undo' : 'Complete' }}</button>
          <button @click="deleteTask(index)">Delete</button>
        </li>
      </ul>
    </div>
    <EditTask :task="$root.currentTask" @updateTask="$root.updateTask" />
    <ul>
      <li v-for="task in tasks">
        {{ task.name }}
      </li>
    </ul>
    <EditTask :task="selectedTask" />
    <div v-if="loading">
      Loading tasks...
    </div>
    <input v-model="searchQuery" @input="searchTasks">
    <p v-if="showWelcomeMessage">{{ welcomeMessage }}</p>
    <TaskList @taskChanged="$root.$emit('updateTaskList')" />
    <SubTaskList :parentTask="selectedTask" />
    <TaskLayout>
      <template v-slot:header>
        <h3>Tasks Overview</h3>
      </template>
      <template v-slot:footer>
        <p>Footer content here</p>
      </template>
    </TaskLayout>
    <p>{{ $store.state.tasks }}</p>
    <template v-if="shouldRender">
      <!-- template logic -->
    </template>

    <button @click="deleteTask(1)">Delete Task 1</button>
    <button @click="deleteTask(2)">Delete Task 2</button>
  </div>
</template>

<script>
import EditTask from '@/components/EditTask.vue';
import TaskList from '@/components/TaskList.vue';
import SubTaskList from '@/components/SubTaskList.vue';
import TaskLayout from '@/layouts/TaskLayout.vue';

export default {
  data() {
    return {
      tasks: [],
      selectedTask: null,
      loading: true,
      searchQuery: '',
      showWelcomeMessage: true,
      welcomeMessage: 'Welcome to your Task Manager!',
      shouldRender: true
    };
  },
  methods: {
    toggleTaskStatus(task) {
      task.completed = !task.completed;
    },
    deleteTask(index) {
      this.tasks.splice(index, 1);
    },
    searchTasks() {
      // Search logic based on searchQuery
    }
  },
  computed: {
    town() {
        return 'Dnipro'
    }
  },
  watch: {
    inputValue(newVal, oldVal) {
      // ...logic...
    }
  },
  created() {
    this.fetchTasks();
  },
  components: {
    EditTask,
    TaskList,
    SubTaskList,
    TaskLayout
  }
};
</script>