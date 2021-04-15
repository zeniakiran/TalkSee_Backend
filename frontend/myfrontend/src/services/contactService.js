import GenericService from "./GenericService";
class ContactService extends GenericService {
  
  getAllContact = () => this.get("contacts/getContact");
  getSingleContact = (id) => this.get("contacts/getContact" + id);
  }

let contactService = new ContactService();
export default contactService;