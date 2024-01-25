<template>
  <ejs-schedule
    id="Schedule"
    ref="ScheduleObj"
    width="100%"
    height="650px"
    :eventSettings="eventSettings"
    :popupOpen="onPopupOpen"
    :editorTemplate="'editorTemplate'"
    currentView="Day"
    :group="group"
    :show-week-number="false"
    :week-rule="`FirstFullWeek`"
    :allow-drag-and-drop="true"
    :enable-appointment-resize="true"
    :first-day-of-week="1"
    :agenda-days-count="31"
    :show-header-bar="true"
  >
    <e-views>
      <e-view option="Day"></e-view>
      <e-view option="Week"></e-view>
      <e-view option="WorkWeek"></e-view>
      <e-view option="Month"></e-view>
    </e-views>
    <template v-slot:eventTemplate="{ data }">
      <div class="template-wrapper">
        <div class="subject">{{ data.Subject }}</div>
      </div>
    </template>
    <e-resources>
      <e-resource
        :allow-multiple="true"
        :data-source="selectedClinicians"
        field="created_for"
        name="Gebruikers"
        text-field="name"
        id-field="id"
      />
      <e-resource
        :allow-multiple="true"
        :data-source="selectedLocations"
        field="location_id"
        name="Locaties"
        text-field="name"
        id-field="id"
      />
    </e-resources>
  </ejs-schedule>
</template>

<script>
import "@syncfusion/ej2-base/styles/material.css";
import "@syncfusion/ej2-buttons/styles/material.css";
import "@syncfusion/ej2-dropdowns/styles/material.css";
import "@syncfusion/ej2-navigations/styles/material.css";
import "@syncfusion/ej2-popups/styles/material.css";
import "@syncfusion/ej2-vue-schedule/styles/material.css";
import {
  ScheduleComponent,
  ViewsDirective,
  ViewDirective,
  Day,
  Week,
  WorkWeek,
  Month,
  Resize,
  DragAndDrop,
  ResourcesDirective,
  ResourceDirective,
} from "@syncfusion/ej2-vue-schedule";

let data = [];
let resource = [1, 2, 3, 4, 5, 6, 7];

//data to map
// for (let i = 1; i < 1; i++) {
//   data.push({
//     Subject: "Paris " + i,
//     StartTime: new Date(),
//     EndTime: new Date(),
//     IsAllDay: true,
//     location_id: resource,
//   });
// }

// for (let i = 0; i < 19; i++) {
//   let startTime = new Date();
//   startTime.setHours(4 + i, 0, 0, 0);
//   let endTime = new Date();
//   endTime.setHours(5 + i, 0, 0, 0);

//   data.push({
//     Subject: "Paris " + i,
//     StartTime: startTime,
//     EndTime: endTime,
//     IsAllDay: false,
//     location_id: resource,
//   });
// }
console.log(data);
export default {
  name: "App",
  components: {
    "ejs-schedule": ScheduleComponent,
    "e-views": ViewsDirective,
    "e-view": ViewDirective,
    "e-resources": ResourcesDirective,
    "e-resource": ResourceDirective,
  },
  data: function () {
    return {
      eventSettings: {
        fields: {
          startTime: { name: "StartTime", validation: { required: true } },
          endTime: { name: "EndTime", validation: { required: true } },
        },
        template: "eventTemplate",
        dataSource: data,
      },
      selectedLocations: [
        { name: "medcin 1", id: 1 }, //need to modify this for med
        { name: "medcin 2", id: 2 },
        { name: "medcin 3", id: 3 },
        { name: "Loc 4", id: 4 },
        { name: "medcin 5", id: 5 },
        { name: "medcin 6", id: 6 },
        { name: "medcin 7", id: 7 },
      ],
      selectedClinicians: [],
      group: {
        byDate: true,
        resources: ["Locaties"],
        allowGroupEdit: false,
        enableCompactView: false,
      },
    };
  },
  methods: {
    onPopupOpen: function (args) {
      if (args.type === "Editor") {
        const formElement = args.element.querySelector(".e-schedule-form");
        let validator = formElement.ej2_instances[0];
        validator.addRules("transferPrice", {
          required: [true, "This field is required."],
        });
      }
    },
  },
  provide: {
    schedule: [Day, Week, WorkWeek, Month, Resize, DragAndDrop],
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
