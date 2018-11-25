
export class User {
    private email: string;
    public id: string;

    public static NULL_USER_MODEL = new User();

    public setEmail(email: string) {
        this.email = email;
    }

    public getEmail() {
        return this.email;
    }

    clone(): User {
        const clone = new User();
        clone.email = this.email;
        clone.id = this.id;
        return clone;
    }
}
