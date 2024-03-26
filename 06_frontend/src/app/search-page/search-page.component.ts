import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-search-page',
  templateUrl: './search-page.component.html',
  styleUrl: './search-page.component.css'
})
export class SearchPageComponent implements OnInit {
  blogs: Array<blogMetadata> = []

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
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
}
