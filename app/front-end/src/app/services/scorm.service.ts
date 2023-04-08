import { Injectable } from "@angular/core";
declare var pipwerks: any;

@Injectable({
  providedIn: "root",
})
export class ScormService {
  scorm = pipwerks.SCORM;
  initData = [false, false, false, false];

  show(msg) {
    pipwerks.UTILS.trace(msg);
    console.log(msg);
  }

  init() {
    this.scorm.version = "1.2";
    this.show("Initializing course.");
    this.scorm.init();
    if (!this.get("cmi.suspend_data")) {
      this.set("cmi.suspend_data", JSON.stringify({courseInfo: this.initData}));
    }
  }

  end() {
    this.show("Terminating connection.");
    this.scorm.quit();
  }

  save() {
    this.scorm.save();
  }

  set(param, value) {
    return this.scorm.set(param, value);
  }

  get(param) {
    return this.scorm.get(param);
  }

  complete(score) {
      this.set("cmi.core.score.raw", score);
      this.set("cmi.core.lesson_status", "completed");
      this.scorm.save();    
  }

  checkComplete() {
    try {
      const videos = JSON.parse(this.get("cmi.suspend_data")).courseInfo;
      return videos.filter((v) => v === true).length === videos.length;
    } catch (e) {
      return false;
    }
  }
}
