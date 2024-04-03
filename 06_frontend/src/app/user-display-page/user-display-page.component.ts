import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DialogComponentComponent } from '../dialog-component/dialog-component.component';
import { UploadService } from '../services/uploadimg.service';
import { AuthService } from '../services/auth.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-user-display-page',
  templateUrl: './user-display-page.component.html',
  styleUrl: './user-display-page.component.css'
})
export class UserDisplayPageComponent {
  animal: string = "";
  name: string = "";

  userData: User = {
    _id: "",
    username: "",
    habits: [],
    email: "",
    description: "",
    streak: {
      current: 0,
      longest: 0,
      total_blogs: 0
    }
  }

  followDetails = {
    followersCount: 0,
    followingCount: 0
  }

  blogs: Array<blogMetadata> = []

  isLoggedIn = false
  isFollowing = true

  constructor(private authService: AuthService, private route: ActivatedRoute) { }

  ngOnInit(): void {

    this.authService.isLoggedIn$.subscribe(
      (loggedIn) => {
        this.isLoggedIn = loggedIn
      }
    )

    this.route.paramMap.subscribe((params) => {
      const username = params.get('username');
      console.log(username)
      // Fetch query here
      this.authService.makeRequest(`users/${username}`, 'get', this.isLoggedIn)
        .subscribe(
          (response) => {
            console.log(response)
            this.userData = response.user
            this.userData.streak = response.streak
            console.log(this.userData)
            this.isFollowing = response.followData.isfollowing

            this.followDetails = response.followData
            this.blogs = response.pages
          },
          (error) => {
            console.error(error)
          }
        )
    });
  }

  changeFollow() {
    if (!this.isFollowing) {
      this.authService.makeRequest(`users/follow`, 'post', this.isLoggedIn, {
        body: {
          userid: this.userData._id
        }
      })
        .subscribe(
          (response) => {
            this.isFollowing = !this.isFollowing
            this.followDetails.followersCount += 1
          },
          (error) => {
            console.error(error)
          }
        )
    }

    else {
      this.authService.makeRequest(`users/unfollow`, 'delete', this.isLoggedIn, {
        body: {
          userid: this.userData._id
        }
      })
        .subscribe(
          (response) => {
            this.isFollowing = !this.isFollowing
            this.followDetails.followersCount -= 1
          },
          (error) => {
            console.error(error)
          }
        )
    }
  }
}
