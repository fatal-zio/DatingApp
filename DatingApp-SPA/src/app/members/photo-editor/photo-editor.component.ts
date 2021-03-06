import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Photo } from '../../models/photo';
import { FileUploader } from 'ng2-file-upload';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { AlertifyService } from 'src/app/services/alertify.service';

@Component({
  selector: 'app-photo-editor',
  templateUrl: './photo-editor.component.html',
  styleUrls: ['./photo-editor.component.css']
})
export class PhotoEditorComponent implements OnInit {
  @Input() photos: Photo[];
  @Output() getMemberPhotoChange = new EventEmitter<string>();
  public uploader: FileUploader;
  public hasBaseDropZoneOver = true;
  public currentMainPhoto: Photo;
  private baseUrl = environment.apiUrl;

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private alertifyService: AlertifyService
  ) {}

  ngOnInit() {
    this.initilizeUploader();
  }

  public fileOverBase(e: any): void {
    this.hasBaseDropZoneOver = e;
  }

  private initilizeUploader() {
    this.uploader = new FileUploader({
      url: this.baseUrl + 'users/' + this.authService.getNameId() + '/photos',
      authToken: 'Bearer ' + localStorage.getItem('token'),
      isHTML5: true,
      allowedFileType: ['image'],
      removeAfterUpload: true,
      autoUpload: false,
      maxFileSize: 10 * 1024 * 1024
    });

    this.uploader.onAfterAddingFile = file => {
      file.withCredentials = false;
    };

    this.uploader.onSuccessItem = (item, response, status, headers) => {
      if (response) {
        const res: Photo = JSON.parse(response);
        const photo = {
          id: res.id,
          url: res.url,
          dateAdded: res.dateAdded,
          description: res.description,
          isMain: res.isMain
        };

        this.photos.push(photo);

        if (res.isMain) {
          this.authService.updateMemberPhoto(photo.url);
        }
      }
    };
  }

  public setMainPhoto(photo: Photo) {
    this.userService
      .setMainPhoto(this.authService.getNameId(), photo.id)
      .subscribe(
        () => {
          this.currentMainPhoto = this.photos.filter(o => o.isMain === true)[0];
          this.currentMainPhoto.isMain = false;
          photo.isMain = true;
          this.authService.updateMemberPhoto(photo.url);
        },
        error => {
          this.alertifyService.error(error);
        }
      );
  }

  public deletePhoto(id: number) {
    this.alertifyService.confirm(
      'Are you sure you want to delete this photo?',
      () => {
        this.userService
          .deletePhoto(this.authService.getNameId(), id)
          .subscribe(
            () => {
              this.photos.splice(this.photos.findIndex(o => o.id === id), 1);
              this.alertifyService.success('Photo deleted.');
            },
            error => {
              this.alertifyService.error(error);
            }
          );
      }
    );
  }
}
