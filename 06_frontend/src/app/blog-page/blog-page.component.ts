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

  blog: blogMetadata = {
    url: "Sample-url",
    title: "Sample text",
    content: "Sample description",
    publish_time: new Date('2023-01-23T19:34:00'),
    last_updated_time: new Date('2023-01-23T19:34:00'),
    upvoted_by: [],
    downvoted_by: [],
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
      this.authService.makeRequest(`page/${this.url}`, 'get', true)
        .subscribe(
          (response) => {
            this.blog = response
            console.log(response)
          },
          (error) => {
            console.error(error)
          }
        )
    });
  }
}
