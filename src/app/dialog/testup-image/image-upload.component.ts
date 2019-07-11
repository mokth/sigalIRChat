import { Component, OnInit, Inject } from '@angular/core';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-image-upload',
  templateUrl: './image-upload.component.html',
  styleUrls: ['./image-upload.component.css']
})

export class ImageUploadComponent implements OnInit {

  title = 'helloworld';
  itemImgUrl:any;
  fileData = null;
  returnValue:any;
  constructor(private http: HttpClient,
              @Inject('MSG_API') public msgUrl: string,
              @Inject(MAT_DIALOG_DATA) public data: any,
              public dialogRef: MatDialogRef<ImageUploadComponent>) { }

  ngOnInit() {
    console.log(this.data.name);
  }

  fileProgress(fileInput: any) {
    this.fileData = <File>fileInput.target.files[0];
  }

  onItemFileChange(e) {
    console.log(e.target.files);
   let val = e.target.files[0];
    if (val) {
      var reader = new FileReader();
      reader.onload = (event: any) => {
        console.log(event);
        this.itemImgUrl = event.target.result;
      }
      reader.readAsDataURL(val);
    }

  }

  onSubmit(e) {
   
    console.log(e.currentTarget[0].files[0]);
    
    const formData = new FormData();
    this.fileData = e.currentTarget[0].files[0];
    console.log(this.fileData);
    formData.append('file', this.fileData);
    this.http.post(this.msgUrl+'api/chat/uploadfile/fruser/'+this.data.name, formData)
      .subscribe((resp:any) => {
        console.log(resp);
        if (resp.ok=="yes"){
           this.returnValue = resp.filename;
           this.dialogRef.close(this.returnValue);
        }
      })
  }

  
  onNoClick(): void {
    this.dialogRef.close('');
  }
  
}
