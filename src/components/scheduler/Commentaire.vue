<template>
  <div>
    <!-- <div>{{ weekNow.map((item) => formatDate(item)) }}</div> -->
    <form class="w-full bg-white rounded-lg" @submit.prevent="addComment">
      <h3 class="font-semibold text-xl p-1 text-center">Commentaire</h3>
      <div class="flex flex-col gap-5 m-3">
        <!-- Comment Container -->
        <div class="max-h-[300px] overflow-auto">
          <div
            class="flex w-full justify-between rounded-md border mb-1 bg-blue-500"
            v-for="(item, i) in commentStore.allComments"
            :key="i"
          >
            <div class="p-2 w-full">
              <div class="flex items-center w-full">
                <div class="text-gray-600 text-white w-full p-2">
                  {{ item.comment }}
                </div>
              </div>
            </div>
            <div class="flex justify-between w-full p-1 px-2 text-white">
              <div class="font-bold w-auto">{{ item.nom }}</div>
              <div>{{ formatTimeDate(item.created_at) }}</div>
            </div>
          </div>
          <div ref="scrollTarget" id="scroll-target"></div>
        </div>
      </div>

      <div class="w-full px-3 mb-2 mt-6">
        <textarea
          class="bg-gray-100 rounded border border-gray-400 leading-normal resize-none w-full h-20 py-2 px-3 font-medium placeholder-gray-400 focus:outline-none focus:bg-white"
          name="body"
          placeholder="mettre votre commentaire ici"
          v-model="form.comment"
        ></textarea>
      </div>

      <div class="w-full flex justify-end px-3 my-3">
        <input
          type="submit"
          class="px-2.5 py-1.5 mr-1 rounded-md text-white text-sm bg-blue-500 text-lg"
          value="Commenter"
        />
        <button
          type="button"
          @click="allCommentInThisWeek"
          class="px-2.5 py-1.5 rounded-md text-white text-sm bg-indigo-600 text-lg"
        >
          Actualiser
        </button>
      </div>
    </form>
  </div>
</template>
<script setup lang="ts">
import { useCommentScheduleStore } from "@/stores/commentSchedule";
import { useToast } from "vue-toastification";
const toast = useToast();

const props = defineProps({
  weekNow: {
    type: Array,
  },
});
const userCookie: any = useCookie("user");
const form = ref({ id_sender: null, comment: null });

const scrollTarget = ref(null);
const allComment = ref([]);

const commentStore = useCommentScheduleStore();
const addComment = async () => {
  form.value = { ...form.value, id_sender: userCookie.value.id };
  console.log(form.value);

  if (form.value.id_sender == null || !form.value.comment) {
    toast.error("Commentaire réquise ");
    return;
  }
  await commentStore.createComment(form.value);
  form.value = { id_sender: null, comment: null };
  allCommentInThisWeek();
};

const allCommentInThisWeek = async (ancred = false) => {
  const weekList = props.weekNow.map((item) => formatDate(item));
  await commentStore.getAllCommentInThisWeek(weekList);
  allComment.value = commentStore.allComments;
  if (ancred) return;
  setTimeout(() => {
    const scrollTargetElement = document.getElementById("scroll-target");
    if (scrollTargetElement) {
      // Faire défiler la liste de commentaires jusqu'à l'élément cible
      scrollTargetElement.scrollIntoView({ behavior: "smooth" });
    } else {
      console.error('Element with id "scroll-target" not found in the DOM.');
    }
  }, 500);
};

function formatDate(dateString) {
  const date = new Date(dateString);
  const year = date.getFullYear();
  let month = (date.getMonth() + 1).toString().padStart(2, "0");
  let day = date.getDate().toString().padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function formatTimeDate(inputDate) {
  const date = new Date(inputDate);
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear().toString();
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");

  return `${day}-${month}-${year} à ${hours}h${minutes}`;
}
onMounted(() => {
  allCommentInThisWeek(true);
});
</script>
