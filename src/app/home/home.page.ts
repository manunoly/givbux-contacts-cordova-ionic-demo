import { Platform } from '@ionic/angular';
import { Component } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Contacts } from '@ionic-native/contacts/ngx';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  type;
  text = 'invit';
  letter = "a";
  contactToInvit;
  letterD = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"];
  query;
  dataC;
  invitArray = [];
  data = [
    {
      displayName: "nombre 1",
      phoneNumbers: [
        {
          value: "593987969776"
        },
        {
          value: "0987969776"
        }
      ],
      emails: [
        {
          value: "manunoly@gmail.com"
        },
        {
          value: "email222@gmail.com"
        }
      ],
      photos: null
    },
    {
      displayName: "nombre 2",
      phoneNumbers: [
        {
          value: "0909809809"
        },
        {
          value: "0909809809"
        }
      ],
      emails: [
        {
          value: "ianaortega7@gmail.com"
        },
        {
          value: "email2@gmail.com"
        }
      ],
      photos: null
    }, {
      displayName: "arnaldo",
      phoneNumbers: [
        {
          value: "0909809809"
        },
        {
          value: "0909809809"
        }
      ],
      emails: [
        {
          value: "ianaortega7@gmail.com"
        },
        {
          value: "email2@gmail.com"
        }
      ],
      photos: null
    }, {
      displayName: "arnaldo prueba valmaceda con el nombre bien bien largo",
      phoneNumbers: [
        {
          value: "0909809809"
        },
        {
          value: "0909809809"
        }
      ],
      emails: null,
      photos: null
    }

  ];

  constructor(private contacts: Contacts, private sanitizer: DomSanitizer, private platform: Platform) { }

  ionViewWillEnter() {
    this.search();
  }

  async search() {
    if (!this.platform.is('cordova')) {
      this.dataC = this.data;
      return;
    }

    this.contacts.find(['*'])
      .then(data => {
        this.dataC = data.map(x => { return { 'photos': x.photos ? x.photos : null, 'displayName': x.displayName ? x.displayName : x.name.formatted ? x.name.formatted : x.name.givenName, 'phoneNumbers': x.phoneNumbers ? x.phoneNumbers : null, 'emails': x.emails ? x.emails : null } }).filter(x => x.phoneNumbers != null || x.emails != null);
      })
      .catch(async (error) => {
        alert(` To allow Givbux to access your contacts, you will need to go to your phone setting.<br> 1. Go to Your phone settings.<br> 2. Select Apps & Notification.<br> 3. Choose the Givbux app. <br> 4. Select Permission. <br> 5. Slide the Contacts button to the right which will now be blue.<br> 6. Login to your account.<br> 7. Select Invite friends and contacts will automatically be visible.<br> `);
      });
  }

  isInvite(name) {
    return this.invitArray.filter(x => x.displayName == name).length > 0 ? true : false;
  }

  filterContacts(datos: Array<any>) {
    if (datos == undefined || datos == null)
      return [];
    if (this.query != undefined && this.query != null && this.query != '')
      return datos.filter(
        (x) => {
          if (x && x.displayName && x.displayName.toLowerCase().includes(this.query.toLowerCase()))
            return x;
          else if (x && x.emails && x.emails != null && x.emails.filter(e => e.value.toLowerCase().includes(this.query.toLowerCase())).length > 0)
            return true;
          else if (x && x.phoneNumbers && x.phoneNumbers != null && x.phoneNumbers.filter(p => p.value.includes(this.query)).length > 0) {
            console.log(x);
            return x;
          }
          return false;
        }

      )
        .slice(0, 100);
    if (this.letter)
      return datos
        .filter(
          x => x && x.displayName && x.displayName.toLowerCase().startsWith(this.letter)
        )
        .slice(0, 100);
    return [];
  }


  selectToInvite(contact) {

    let contactPost = {};

    contactPost['photourl'] = 'assets/imgs/avatar.png';
    contactPost['displayName'] = contact.displayName ? contact.displayName : 'Friend';

    if (contact.photos && contact.photos != null && contact.photos.length > 0)
      contactPost['photourl'] = this.getUrl(contact.photos[0].value);

    if (contact['phoneNumbers'] != undefined && contact['phoneNumbers'] != null) {
      let tmp = [];
      contact['phoneNumbers'].forEach(element => {
        tmp.push(element.value);
        console.log('push this value', element.value);
      });
      console.log('luego de borrar los phoneNumbers', contact);
      contactPost['phoneNumbers'] = tmp;
    }

    if (contact['emails'] != undefined && contact['emails'] != null) {
      let tmp = [];
      contact['emails'].forEach(element => {
        tmp.push(element.value);
      });
      contactPost['emails'] = tmp;
    }

    console.log('constacto a enviar', contact);


    if (this.invitArray.length > 0 && this.invitArray.filter(x => x.displayName == contactPost['displayName']).length > 0)
      return this.invitArray = this.invitArray.filter(x => x.displayName != contactPost['displayName']);

    this.invitArray.push(contactPost);
  }

  getUrl(url) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  setQuery(query) {
    console.log(query);
    this.query = query;
  }

  setLetter(item) {
    this.letter = item;
  }
}
