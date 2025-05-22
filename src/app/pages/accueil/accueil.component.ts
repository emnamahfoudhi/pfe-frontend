import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FooterComponent } from '../footer/footer.component';

@Component({
  selector: 'app-accueil',
  standalone: true,
  imports: [CommonModule, RouterModule, FooterComponent],
  templateUrl: './accueil.component.html',
  styleUrl: './accueil.component.css',
})
export class AccueilComponent {
  setTheme(theme: 'light' | 'dark') {
    console.log('Thème choisi :', theme);
    // Intègre la logique ici
  }

  changeLanguage(lang: string) {
    console.log('Langue choisie :', lang);
    // Intègre ton changement ici
  }
  events = [
    {
      id: 1,
      title: 'Séminaire sur la transformation numérique',
      description:
        "Un séminaire sur les dernières tendances de la transformation numérique et leur impact sur l'industrie.",
      image: 'assets/images/petrole.jpg',
    },
    {
      id: 2,
      title: "Atelier sur l'intelligence artificielle",
      description:
        "Un atelier interactif sur les applications récentes de l'IA et les technologies émergentes.",
      image: 'assets/images/petrole.jpg',
    },
    {
      id: 3,
      title: 'Conférence sur la cybersécurité',
      description:
        'Une conférence sur la cybersécurité et les défis actuels pour les entreprises.',
      image: 'assets/images/petrole.jpg',
    },
    {
      id: 4,
      title: 'Hackathon interne',
      description:
        "Un hackathon pour stimuler l'innovation au sein de l'entreprise avec des prix pour les meilleurs projets.",
      image: 'assets/images/petrole.jpg',
    },

    {
      id: 5,
      title: 'Formation sur les méthodologies DevOps',
      description:
        "Une session de formation sur l'intégration continue, la livraison continue, et l'automatisation des processus DevOps.",
      image: 'assets/images/petrole.jpg',
    },
  ];

  selectedEvent: any = null;

  openModal(event: any) {
    this.selectedEvent = event;
  }

  closeModal() {
    this.selectedEvent = null;
  }
}
