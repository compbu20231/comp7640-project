import { Component, OnInit, OnDestroy, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { NavbarService } from 'src/app/services/navbar.service';
import { ScormService } from 'src/app/services/scorm.service';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
declare var $: any;

@Component({
  selector: 'app-video',
  templateUrl: './video.component.html',
  styleUrls: ['./video.component.scss']
})
export class VideoComponent implements OnInit {

  sub;
  isOpenModal = false;
  id: number = 1;
  link: string;
  video:any;
  isViewed = false;
  isCompleted = false;
  isPlay = false;
  supposedCurrentTime = 0;
  isEnded = false;

  @ViewChild('vid')
  public vid: ElementRef;

  constructor(private nbSerive: NavbarService, private scormService: ScormService, private route: ActivatedRoute,
              private httpClient: HttpClient, private router: Router) { }

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      this.id = +params.id;
      this.isEnded = false;
      this.loadVideo(this.id);
    });
  }

  openSideNav(event) {
    event.preventDefault();
    this.nbSerive.changeNavBarStatus(true);
    this.nbSerive.changeIsManualClosed(false);
  }

  loadVideo(id) {
    this.nbSerive.getVideoById(id).then(video => {
      this.video = video;
      console.log(video);
      if (video) {
        this.vid.nativeElement.src = video.path;
        this.vid.nativeElement.load();
        try {
          const courseInfo = JSON.parse(this.scormService.get('cmi.suspend_data')).courseInfo;
          if (courseInfo) {
            this.isViewed = courseInfo[id - 1];
          }
        } catch (e) {
        }
      }
    });
  }


  vidEnded() {
    try {
      const courseInfo = JSON.parse(this.scormService.get('cmi.suspend_data')).courseInfo;
      if (courseInfo) {
        courseInfo[this.id - 1] = true;
        this.isViewed = true;
        this.scormService.set('cmi.suspend_data', JSON.stringify({courseInfo}));
        this.scormService.save();
      }
    } catch(e) {

    }
    this.supposedCurrentTime = 0;
    this.isEnded = true;
    this.sendDataToGoogleSheet('completed');
    this.loadNext();
  }

  vidSeeking(video) {
    const delta = video.currentTime - this.supposedCurrentTime;
    if (Math.abs(delta) > 0.01 && !this.isViewed) {
      console.log('Seeking is disabled');
      video.currentTime = this.supposedCurrentTime;
    }
  }

  vidUpdate(video) {
    if (!video.seeking && !this.isViewed) {
      this.supposedCurrentTime = video.currentTime;
    }
  }

  reload() {
    this.vid.nativeElement.src = this.video.path;
    this.vid.nativeElement.load();
    this.vid.nativeElement.play();
    console.log('Reload Video');
  }

  loadNext() {
    if (this.id >= 4) {
      this.router.navigate(['/home']);
    } else {
      this.id++;
      this.isEnded = false;
      this.router.navigate(['/video', this.id]);
    } 
  }

  sendDataToGoogleSheet(action) {
    const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzRsJEqYUfJbMRv7JdWfTkyPg5zW_wp7FS-jq2E-Uj_kwDuHTA/exec';
    const data = {
      name: this.scormService.get('cmi.core.student_name'),
      video: this.video.chp + " " + this.video.title,
      time: new Date().toLocaleString(),
      action
    };
    const header = new HttpHeaders();
    header.set('Access-Control-Allow-Origin', '*');
    // tslint:disable-next-line: max-line-length
    this.httpClient.post(SCRIPT_URL, JSON.stringify(data), {headers: header})
      .toPromise().then((response) => console.log(response)).catch(e => console.log(e));
  }

}
