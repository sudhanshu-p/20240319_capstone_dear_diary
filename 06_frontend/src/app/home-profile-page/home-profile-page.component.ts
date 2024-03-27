import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-home-profile-page',
  templateUrl: './home-profile-page.component.html',
  styleUrl: './home-profile-page.component.css'
})
export class HomeProfilePageComponent implements OnInit {
  isHome: boolean = true

  username: string = ""

  data = {
    title: "Dear Diary",
    description: `Lorem ipsum, dolor sit amet consectetur adipisicing elit. Alias vero consectetur labore praesentium
    minus hic tempora, sint, consequatur et quisquam dicta, est laudantium minima quaerat.`
  }

  blogs: Array<blogMetadata> = [
  ]

  constructor(private authService: AuthService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.data.subscribe(data => {
      this.isHome = data['home'];
    });

    if (this.isHome) {
      this.authService.makeRequest('page/search?recent=true', 'get', false)
        .subscribe(
          (response) => {
            this.blogs = response
            console.log(response)
          },
          (error) => {
            console.error(error)
          }
        )
    }
    else {
      this.route.params.subscribe(params => {
        this.username = params['username'];

        // Fetching the user data
        this.authService.makeRequest(`users/${this.username}`, 'get', true)
          .subscribe(
            (response) => {
              this.data.title = response.username
              this.data.description = response.description
              console.log(response)
            },
            (error) => {
              console.error(error)
            }
          )

        // Fetching the users blogs
        this.authService.makeRequest(`page/search?author=${this.username}`, 'get', true)
          .subscribe(
            (response) => {
              this.blogs = response
              console.log(response)
            },
            (error) => {
              console.error(error)
            }
          )
      });
    }



  }
}
