import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class NavbarService {

  navbarStatusChanged = new Subject<boolean>();
  manualStatusChanged = new Subject<boolean>();
  modalStatusChanged = new Subject<boolean>();
  videoIdChanged = new Subject<number>();
  videosChanged = new Subject<any>();
  slidesStatusChanged = new Subject<any>();
  private isOpen = false;
  private isManualClose = false;
  private isOpenModal = false;
  private videoId = 1;
  baseUrl = ".";

  private videos: any[];

  constructor(private httpClient: HttpClient, private router: Router) {
    this.httpClient.get('./assets/data/url.json').toPromise().then((url: any) => {
      this.baseUrl = url.baseUrl;
    });

    this.httpClient.get('./assets/data/videos.json').toPromise().then((videos: any) => {
      this.videos = videos;
      this.videosChanged.next(videos);
    });
  }


  getAllUsers() {
    return this.httpClient.get(`${this.baseUrl}/users`).toPromise();
  }


  getNavbarStatus() {
    return this.isOpen;
  }

  changeNavBarStatus(isOpen: boolean) {
    this.isOpen = isOpen;
    this.navbarStatusChanged.next(isOpen);
  }


  changeIsManualClosed(isManualClose: boolean) {
    this.isManualClose = isManualClose;
    this.manualStatusChanged.next(isManualClose);
  }

  setVideo(id: number) {
    this.videoId = id;
    this.videoIdChanged.next(id);
  }

  changeVideosSatus() {
    this.httpClient.get('./assets/data/videos.json').toPromise().then((videos: any) => {
      this.videos = videos;
      this.videosChanged.next(videos);
    });
  }

  changeModalStatus(isOpenModal: boolean) {
    this.isOpenModal = isOpenModal;
    this.modalStatusChanged.next(isOpenModal);
  }

  openLink(b) {
    if (b.rlink) {
      this.goTo(b.rlink);
    } else if (b.link) {
      window.open(b.link);
    }
  }

  goTo(route: string) {
    this.router.navigate([route]);
  }

  async getVideoById(id): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.httpClient.get('./assets/data/videos.json')
        .toPromise().then((vi: any[]) => {
          resolve(vi.find(v2 => v2.id === id));
        })
        .catch((e) => reject(e.message));
    });
  }


}
