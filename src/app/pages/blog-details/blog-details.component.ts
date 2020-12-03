import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IBlog } from 'src/app/shared/interfaces/blog.interface';
import { BlogsService } from 'src/app/shared/services/blogs.service';

@Component({
  selector: 'app-blog-details',
  templateUrl: './blog-details.component.html',
  styleUrls: ['./blog-details.component.scss']
})
export class BlogDetailsComponent implements OnInit {

  blog: IBlog;

  constructor(
    private activatedRoute: ActivatedRoute,
    private blogService: BlogsService,
    public location: Location) { }

  ngOnInit(): void {
    this.getBlog();
  }

  private getBlog(): void {
    let id = this.activatedRoute.snapshot.paramMap.get('id');
    this.blogService.getSingleBlog(id).subscribe(
      data => {
        this.blog = data.data();
      }
    )
  }
}
