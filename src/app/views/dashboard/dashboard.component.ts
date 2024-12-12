import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  dashboardItems = [
    { iconSrc: 'https://www.acaexplorers.com/explorers/img/clan.png', altText: 'Clan Dashboard', label: 'Clan Dashboard', show: true },
    { iconSrc: 'https://www.acaexplorers.com/explorers/img/braindump_icon.png', altText: 'Brain Dump', label: 'Brain Dump', show: false },
    { iconSrc: 'https://www.acaexplorers.com/explorers/img/message.png', altText: 'ACA Explorer Chat', label: 'ACA Explorer Chat', show: false },
    { iconSrc: 'https://www.acaexplorers.com/explorers/img/profile.png', altText: 'Explorer Profile', label: 'Explorer Profile', show: false },
    { iconSrc: 'https://www.acaexplorers.com/explorers/img/mastery.png', altText: 'Mastery', label: 'Mastery', show: false },
    { iconSrc: 'https://www.acaexplorers.com/explorers/img/audio_board.png', altText: 'Audio Upload - Subir', label: 'Audio Upload - Subir', show: false },
    { iconSrc: 'https://www.acaexplorers.com/explorers/img/audio_record.png', altText: 'Audio Record - Grabar', label: 'Audio Record - Grabar', show: false },
    { iconSrc: 'https://www.acaexplorers.com/explorers/img/searchword.png', altText: 'SearchWord', label: 'SearchWord', show: false },
    { iconSrc: 'https://www.acaexplorers.com/explorers/img/teamwork.png', altText: 'Study Report', label: 'Study Report', show: true },
    { iconSrc: 'https://www.acaexplorers.com/explorers/img/gsuite.png', altText: 'G-Suite', label: 'G-Suite', show: false },
    { iconSrc: 'https://www.acaexplorers.com/explorers/img/wiki.png', altText: 'ACA Wiki', label: 'ACA Wiki', show: false },
    { iconSrc: 'https://www.acaexplorers.com/explorers/img/aca_ipa.png', altText: 'ACA IPA - beta', label: 'ACA IPA - beta', show: false },
    { iconSrc: 'https://www.acaexplorers.com/explorers/img/forum.png', altText: 'ACA FORUM', label: 'ACA FORUM', show: false },
    { iconSrc: 'https://www.acaexplorers.com/explorers/img/3LayersofChange.png', altText: '3 Layers of Change', label: '3 Layers of Change<br />3 Capas de Cambio', show: false }
  ];

  visibleDashboardItems: any[][] = [];

  constructor() { }

  ngOnInit() {
    this.filterAndGroupItems();
  }

  filterAndGroupItems() {
    const filteredItems = this.dashboardItems.filter(item => item.show);
    console.log(filteredItems);
    this.visibleDashboardItems = [];

    for (let i = 0; i < filteredItems.length; i += 4) {
      this.visibleDashboardItems.push(filteredItems.slice(i, i + 4));
    }

    console.log(this.visibleDashboardItems);
  }
  
}
