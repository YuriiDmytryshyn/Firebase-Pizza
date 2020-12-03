
import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { IBlog } from '../interfaces/blog.interface';

@Injectable({
  providedIn: 'root'
})
export class BlogsService {

  private dbPath = '/blogs';
  blogsRef: AngularFirestoreCollection<IBlog> = null;

  constructor(private db: AngularFirestore) {
    this.blogsRef = this.db.collection(this.dbPath);
  }

  getAll(): AngularFirestoreCollection<IBlog> {
    return this.blogsRef;
  }

  getSingleBlog(id: string): any {
      return this.blogsRef.doc(id).get();
  }

  create(blog: IBlog): any {
    return this.blogsRef.add({ ...blog });
  }

  update(id: string, data: any): Promise<void> {
    return this.blogsRef.doc(id).update(data);
  }

  delete(id: string): Promise<void> {
    return this.blogsRef.doc(id).delete();
  }
}
