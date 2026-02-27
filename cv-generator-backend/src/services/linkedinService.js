const axios = require('axios');

class LinkedInService {
  constructor(accessToken) {
    this.accessToken = accessToken;
    this.baseUrl = 'https://api.linkedin.com/v2';
  }

  async getProfile() {
    try {
      const profileResponse = await axios.get(`${this.baseUrl}/me`, {
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'cache-control': 'no-cache',
          'X-Restli-Protocol-Version': '2.0.0'
        },
        params: {
          projection: '(id,firstName,lastName,profilePicture(displayImage~:playableStreams))'
        }
      });

      const emailResponse = await axios.get(`${this.baseUrl}/emailAddress`, {
        headers: { 'Authorization': `Bearer ${this.accessToken}` },
        params: { q: 'members', projection: '(elements*(handle~))' }
      });

      const profile = profileResponse.data;
      const emailData = emailResponse.data;
      const firstName = this.getLocalizedValue(profile.firstName);
      const lastName = this.getLocalizedValue(profile.lastName);

      let photoUrl = null;
      if (profile.profilePicture?.['displayImage~']?.elements) {
        const images = profile.profilePicture['displayImage~'].elements;
        const largestImage = images[images.length - 1];
        photoUrl = largestImage?.identifiers?.[0]?.identifier;
      }

      const email = emailData.elements?.[0]?.['handle~']?.emailAddress;

      return {
        firstName,
        lastName,
        email,
        photo: photoUrl,
        linkedinId: profile.id
      };
    } catch (error) {
      console.error('LinkedIn profile fetch error:', error.response?.data || error);
      throw new Error('Error al obtener perfil de LinkedIn');
    }
  }

  getLocalizedValue(localizedField) {
    if (!localizedField?.localized) return '';
    const locale = Object.keys(localizedField.localized)[0];
    return localizedField.localized[locale] || '';
  }

  static formatForCV(linkedinData) {
    return {
      personalInfo: {
        firstName: linkedinData.firstName || '',
        lastName: linkedinData.lastName || '',
        photo: linkedinData.photo,
        contact: {
          email: linkedinData.email || '',
          linkedin: `https://www.linkedin.com/in/${linkedinData.linkedinId}`
        }
      },
      importedFrom: {
        source: 'linkedin',
        importedAt: new Date()
      }
    };
  }
}

module.exports = LinkedInService;
