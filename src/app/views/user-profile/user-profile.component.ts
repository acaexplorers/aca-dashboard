import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {
  physicalEnabled: boolean = true;
  
  sections = [
    { name: 'SCHOLAR', enabled: true },
    { name: 'MASTERY', enabled: true },
    { name: 'GS', enabled: true },
    { name: 'CLAN', enabled: true },
    { name: 'HT', enabled: true },
    { name: 'I+1', enabled: false }
  ];

  constructor() { }

  ngOnInit() {
  }
}