describe('My First API', () => {
    
    const baseUrl = 'https://gorest.co.in/public/v2/';

    const token = '22cc1cfd21faf31af2bd41269c21e4ba34086899508832700892b1bddbf2e3a0';

    let userId;

    //Test scenario no. 1

    // -- Verify that the user is successfully created with the required fields (name, email, gender, status)
    // -- Verify that response status is 201
    // -- Verify that the response contains ID of the new user

    it('Create new user', () => {             // Ovde kao prvi argument stavljam sta ocekujem od ovog request-a, u ovom slucaju da kreiram novog korisnika
        cy.request({
            method: 'POST',                   // Ovo je koju metodu koristim, u ovom slucaju POST
            url: `${baseUrl}/users`,          // Ovde postavljamo baseUrl, odnosno end point gde zelimo da posaljemo request
            headers: {
                Authorization: `Bearer ${token}` // Token za autorizaciju
            },
            body: {                              // U body stavljamo strukturu i elemnte naseg zahteva
                name: 'John Johnson',
                email: '1mma1@test.com',
                gender: 'male',
                status: 'active'
            }
        }).then((response) => {                     // U response ocekujemo kakav je odgovor na nas zahtev
            expect(response.status).to.be.eq(201);
            expect(response.body).to.have.property('id');
            userId = response.body.id;
        });
    }); 



    //Test scenario no. 2

    // -- Verify that the user can be successfully updated (name, email, gender, status)
    // -- Verify that the response status is 200
    // -- Ensure that the updated details are correctly saved

    it('Update user info', () => {                        // Ovde zelim da uradim neke izmene (update) korisnika
        cy.request({
            method: 'PUT',                                // Koristim PUT metodu
            url: `${baseUrl}/users/${userId}`,
            headers: {
                Authorization: `Bearer ${token}`
            },
            body: {                                        // U body stavljam samo delove koje zelim da izmenim u ovom slucaju name i email
                name: 'John Jones',
                email: '11mma-champion@test.com'
            }
        }).then((response) => {                   // Odgovor koji ocekujem u ovovm slucaju status kod 200 name promenjeno u John Jones i email promenjen u 11mma-champion@test.com
            expect(response.status).to.be.eq(200);
            expect(response.body.name).to.be.eq('John Jones');
            expect(response.body.email).to.be.eq('11mma-champion@test.com');
        });
    });


    //Test scenario no. 3

    // -- Verify that the user is successfully deleted
    // -- Verify that the response status is 204
    // -- Verify that the user is deleted from the system (response status 404 when trying to fetch the deleted user)

    it('Delete user', () => {                    // Brisanje korisnika
        cy.request({
            method: 'DELETE',                       // Koristim DELETE metodu
            url: `${baseUrl}/users/${userId}`,
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).then((response) => {
            expect(response.status).to.be.eq(204);
        })

        cy.request({
            method: 'GET',                               // Ovom metodom zelim samo da proverim da li sam uspesno obrisao korisnika
             url: `${baseUrl}/users/${userId}`,          // Get metodom potrazujem podatke o korisniku, a posto sam ga u prethodnom koraku obrisao
            headers: {                                   // ovde ocekujem da je status kod 404 odnosno da ne postoji
                Authorization: `Bearer ${token}`
            },
            failOnStatusCode: false
        }).then((response) => {
                expect(response.status).to.be.eq(404);
        });
    })

    
});