import { Component } from '@angular/core';

@Component({
  selector: 'app-home-profile-page',
  templateUrl: './home-profile-page.component.html',
  styleUrl: './home-profile-page.component.css'
})
export class HomeProfilePageComponent {
  data = {
    title: "Dear Diary",
    description: `Lorem ipsum, dolor sit amet consectetur adipisicing elit. Alias vero consectetur labore praesentium
    minus hic tempora, sint, consequatur et quisquam dicta, est laudantium minima quaerat.`
  }

  blog: blogMetadata = {
    title: "Implementing Credential-based Authentication with SvelteKit and MongoDB",
    description: "Instructions on how to implement Authentication with SvelteKit with MongoDB as the Database",
    date: new Date('2023-01-23T19:34:00')
  }
}
