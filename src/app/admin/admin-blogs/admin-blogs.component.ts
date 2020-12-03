import { Component, OnInit } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { Observable } from 'rxjs';
import { IBlog } from 'src/app/shared/interfaces/blog.interface';
import { BlogsService } from 'src/app/shared/services/blogs.service';
import { map } from 'rxjs/operators';
import { IProduct } from 'src/app/shared/interfaces/product.interface';

@Component({
  selector: 'app-admin-blogs',
  templateUrl: './admin-blogs.component.html',
  styleUrls: ['./admin-blogs.component.scss']
})
export class AdminBlogsComponent implements OnInit {

  blogID: number | string;
  date = new Date().toISOString().slice(0, 10);
  blogTitle: string;
  blogText: string;
  blogAuthor: string;
  blogImage = 'https://image.freepik.com/free-photo/pizza-pizza-filled-with-tomatoes-salami-and-olives_140725-1200.jpg';
  editStatus = true;
  uploadPercent: Observable<number>;
  upload = false;

  adminBlogs: Array<IBlog> = [];

  constructor(
    private blogsService: BlogsService,
    private storage: AngularFireStorage
  ) { }

  ngOnInit(): void {
    this.getAdminBlogs();
  }

  getAdminBlogs(): void {
    this.blogsService.getAll().snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ id: c.payload.doc.id, ...c.payload.doc.data() })
        )
      )
    ).subscribe(data => {
      this.adminBlogs = data;
    });
  };

  addAdminBlog(): void {
    if (this.blogTitle.length === 0 || this.blogText.length === 0 || this.blogAuthor.length === 0) {
      this.blogTitle = '';
      this.blogText = '';
      this.blogAuthor = '';
    } else if (this.blogTitle.length !== 0 || this.blogText.length !== 0 || this.blogAuthor.length !== 0) {
      const newBlog = {
        id: 1,
        title: this.blogTitle,
        text: this.blogText,
        image: this.blogImage,
        date: this.date,
        author: this.blogAuthor
      }
      delete newBlog.id;
      this.blogsService.create(newBlog);
      this.resetForm();
    }
  };

  deleteAdminBlog(blog: IBlog): void {
    this.blogID = blog.id;
    this.blogsService.delete(this.blogID.toString())
      .then(() => {
        console.log('The product was updated successfully!');
      })
      .catch(err => console.log(err));
  };

  editAdminBlog(blog: IBlog): void {
    this.blogID = blog.id;
    this.blogTitle = blog.title;
    this.blogText = blog.text;
    this.blogAuthor = blog.author;
    this.editStatus = false;
  };

  saveEditAdminBlog(): void {
    const updBlog = {
      id: this.blogID,
      title: this.blogTitle,
      text: this.blogText,
      image: this.blogImage,
      date: this.date,
      author: this.blogAuthor
    };
    this.blogsService.update(updBlog.id.toString(), updBlog)
      .then(() => console.log('The product was updated successfully!'))
      .catch(err => console.log(err));
    this.resetForm();
    this.editStatus = true;

  };

  private resetForm(): void {
    this.blogTitle = '';
    this.blogText = '';
    this.blogAuthor = '';
  };

  uploadFile(event): void {
    const file = event.target.files[0];
    const filePath = `images/${file.name}`;
    const ref = this.storage.ref(filePath);
    const task = ref.put(file);
    this.uploadPercent = task.percentageChanges();
    this.uploadPercent.subscribe(data => {
      if (data > 0 || data < 100) {
        this.upload = true;
      }
    });
    task.then(image => {
      this.storage.ref(`images/${image.metadata.name}`).getDownloadURL().subscribe(url => {
        this.blogImage = url;
        this.upload = false;
      });
    });
  };

}
