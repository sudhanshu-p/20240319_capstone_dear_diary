import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { MarkdownService } from 'ngx-markdown';

@Component({
  selector: 'app-blog-page',
  templateUrl: './blog-page.component.html',
  styleUrl: './blog-page.component.css'
})
export class BlogPageComponent implements OnInit {
  url: string | null = "";
  comment_content: string = ""

  blog: blogMetadata = {
    url: "Sample-url",
    title: "Sample text",
    content: "Sample description",
    publish_time: new Date('2023-01-23T19:34:00'),
    last_updated_time: new Date('2023-01-23T19:34:00'),
    upvoted_by: [],
    downvoted_by: [],
    comments: []
  }

  formatDate(date: Date) {
    // This step is... mandatory... I have no idea why...
    date = new Date(date)
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const year = date.getFullYear();
    const month = months[date.getMonth()];
    const day = date.getDate();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const ampm = date.getHours() >= 12 ? 'PM' : 'AM';

    return `${month} ${day}, ${year} | ${hours}:${minutes} ${ampm}`;
  }

  constructor(private route: ActivatedRoute, private authService: AuthService,
    private markdownService: MarkdownService) { }

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      this.url = params.get('url');
      // Fetch query here
      this.authService.makeRequest(`page/${this.url}`, 'get', false)
        .subscribe(
          (response) => {
            console.log(response)
            this.blog = response
          },
          (error) => {
            console.error(error)
          }
        )
    });
  }
  upvotePost() {
    this.authService.makeRequest(`pages/upvote/${this.blog.url}`, 'post', true)
      .subscribe(
        (response) => {
          console.log(response)
          this.blog = response
        },
        (error) => {
          console.error(error)
        }
      )
  }

  downvotePost() {
    this.authService.makeRequest(`pages/downvote/${this.blog.url}`, 'post', true)
      .subscribe(
        (response) => {
          console.log(response)
          this.blog = response
        },
        (error) => {
          console.error(error)
        }
      )
  }

  sendComment() {
    const dataToBeSent = {
      content: this.comment_content
    }

    this.authService.makeRequest(`pages/comment/${this.blog.url}`, 'post', true, { body: dataToBeSent })
      .subscribe(
        (response) => {
          console.log(response)
          this.blog = response
        },
        (error) => {
          console.error(error)
        }
      )
  }

  upvoteComment(comment_id: string) {
    const dataToBeSent = {
      comment_id: comment_id
    }

    this.authService.makeRequest(`pages/${this.blog.url}/comments/upvote`, 'post', true, { body: dataToBeSent })
      .subscribe(
        (response) => {
          console.log(response)
          const comment_index = this.blog.comments.findIndex(comment => comment._id = comment_id)
          this.blog.comments[comment_index] = response
        },
        (error) => {
          console.error(error)
        }
      )
  }

  downvoteComment(comment_id: string) {
    const dataToBeSent = {
      comment_id: comment_id
    }

    this.authService.makeRequest(`pages/${this.blog.url}/comments/downvote`, 'post', true, { body: dataToBeSent })
      .subscribe(
        (response) => {
          console.log(response)
          const comment_index = this.blog.comments.findIndex(comment => comment._id = comment_id)
          this.blog.comments[comment_index] = response
        },
        (error) => {
          console.error(error)
        }
      )
  }
}
