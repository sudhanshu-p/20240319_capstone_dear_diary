import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MarkdownService } from 'ngx-markdown';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { MatTabChangeEvent } from '@angular/material/tabs';

@Component({
  selector: 'app-create-page',
  templateUrl: './create-page.component.html',
  styleUrl: './create-page.component.css'
})
export class CreatePageComponent implements OnInit {
  @ViewChild('toggleCheckbox') toggleCheckbox: ElementRef | undefined;
  @ViewChild('usernameCheckbox') usernameCheckbox: ElementRef<HTMLInputElement> | undefined;

  getUsernameAnonymousValue(): boolean {
    if (this.usernameCheckbox && this.usernameCheckbox.nativeElement.checked) {
      return false;
    } else {
      return true;
    }
  }

  selectedTabLabel = 'Journal'; // Initial selected tab (optional)
  showPrivacyToggles = true; // Initial visibility state
  isPublic = true; // Initial state: Public selected
  habitsShowing = false

  userHabits: Array<HabitInput> = [
    {
      title: 'Swimming',
      done: false,
      written_content: ''
    },
    {
      title: 'Running',
      done: false,
      written_content: ''
    }
  ]

  tabs: Tab[] = [
    {
      title: 'Blog',
    },
    {
      title: 'Journal',
    },
    {
      title: 'Collaborative',
    }
  ];

  activeTabIndex: number = 1;

  selectTab(index: number) {
    this.activeTabIndex = index;
    if (index === 0) {
      this.showPrivacyToggles = true
    }
    else {
      this.showPrivacyToggles = false
    }
  }

  onPrivacyChange(isPublic: boolean) {
    this.isPublic = isPublic;
  }

  showHabits() {
    this.habitsShowing = !this.habitsShowing
  }

  habitDoneChanged(habit: HabitInput) {
    habit.done = !habit.done
  }

  blogTitle: string = ''
  blogContent: string = '';
  private: boolean = true;

  postSaved: boolean = false;

  constructor(
    private markdownService: MarkdownService,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    // Fetch the user habits
    this.authService.makeRequest("users/habits", "get", true)
      .subscribe((response) => {
        console.log(response)
      })
  }

  insertMarkdown(prefix: string, helperText: string, suffix: string) {
    const textareaEl = document.querySelector('textarea');

    if (textareaEl) {
      const textarea = textareaEl as HTMLTextAreaElement;
      // Start represents the index of textarea before selection
      const start = textarea.selectionStart;
      // End represents the index of textarea after selection
      const end = textarea.selectionEnd;


      const selectedText = this.blogContent.substring(start, end);

      // If some text is selected, ignore helper
      if (selectedText) {
        const newText = `${prefix}${selectedText}${suffix}`;
        this.blogContent =
          this.blogContent.substring(0, start) +
          newText +
          this.blogContent.substring(end);
      }
      // Else add Helper 
      else {
        this.blogContent =
          this.blogContent.substring(0, start) +
          prefix +
          helperText +
          suffix +
          this.blogContent.substring(end);
      }

      textarea.selectionStart = textarea.selectionEnd = start + prefix.length;
      textarea.focus();
    }
  }

  updatePostContentWithHabits(): string {
    let updatedPage = this.blogContent

    updatedPage += `\n\n ## Habits`

    for (let index = 0; index < this.userHabits.length; index++) {
      updatedPage += `\n\n ### - ${this.userHabits[index].title} - ${this.userHabits[index].done ? '✅' : '❌'} \n ${this.userHabits[index].written_content}`
    }

    return updatedPage
  }

  savePost() {
    // Calling the POST API
    if (!this.toggleCheckbox) {
      return
    }
    const isPrivate = this.toggleCheckbox.nativeElement.checked;

    let postContent = this.blogContent

    if (this.tabs[this.activeTabIndex].title === "Journal") {
      postContent = this.updatePostContentWithHabits()
    }

    const dataToBeSent = {
      "title": this.blogTitle,
      "content": postContent,
      "visibility": isPrivate ? "private" : "public",
      "posttype": this.tabs[this.activeTabIndex].title,
      "anonymous": this.getUsernameAnonymousValue(),
    }
    this.authService.makeRequest(`page`, 'post', true, { body: dataToBeSent })
      .subscribe(
        (response) => {
          console.log(response)
          this.router.navigate([`/pages/${response.url}`])
        },
        (error) => {
          console.error(error)
        }
      )
  }

  openFileInput() {
    console.log("File input opened")
  }

  handleImageUpload() {
    console.log("File input opened")
  }
}
