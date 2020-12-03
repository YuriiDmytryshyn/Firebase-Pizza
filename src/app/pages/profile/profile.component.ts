import { Component, OnInit, TemplateRef } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  modalRef: BsModalRef;
  uploadPercent: Observable<number>;
  addModalHeight = 500;
  fileUploaded = false;
  dynamic: number = 0;

  Status = false;
  myFirstName: string;
  myLastName: string;
  myCity: string;
  myOld: number;
  currentUser: any = null;
  userImage = 'assets/images/no-person.jpg';

  constructor(
    private modalService: BsModalService,
    private storage: AngularFireStorage,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.userCredential();
  }

  private userCredential(): void {
    this.currentUser = JSON.parse(localStorage.getItem('user'));
    this.myFirstName = this.currentUser.firtName;
    this.myLastName = this.currentUser.lastName;
    this.myCity = this.currentUser.city;
    this.myOld = this.currentUser.old;
    if (this.currentUser.image != undefined) {
      this.Status = true;
    }
    this.userImage = this.currentUser.image;
  }

  cheackLocalUser(): void {
    if (this.myFirstName && this.myLastName && this.myCity && this.myOld) {
      if (localStorage.getItem('user')) {
        let user = JSON.parse(localStorage.getItem('user'));
        if (user.firtName === undefined || user.lastName === undefined || user.old === undefined || user.city === undefined) {
          const data = {
            firtName: this.myFirstName,
            lastName: this.myLastName,
            city: this.myCity,
            old: this.myOld,
            image: this.userImage
          };
          this.authService.updateUserData(user.id, data);
          this.updateLocal(data);
        }
      }
    }
  };

  private updateLocal(data): void {
    const local = {
      ...this.currentUser,
      ...data
    };
    localStorage.setItem('user', JSON.stringify(local))
  }

  uploadFile(event): void {
    const file = event.target.files[0];
    const filePath = `images/${file.name}`;
    const ref = this.storage.ref(filePath);
    const task = ref.put(file);
    this.uploadPercent = task.percentageChanges();
    this.uploadPercent.subscribe(data => {
      if (data === 100) {
        this.dynamic = 100;
      }
    });
    task.then(image => {
      this.storage.ref(`images/${image.metadata.name}`).getDownloadURL().subscribe(url => {
        this.Status = true;
        this.userImage = url;
        this.addModalHeight = 540;
        this.fileUploaded = true;
      });
    });
  };

  openModalAdd(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  };

}
