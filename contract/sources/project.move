module Library::LibraryCatalogue {
    use std::string;
    use std::signer;
    use std::vector;
    use std::table;

    // Error codes
    const EBOOK_UNAVAILABLE: u64 = 1;
    const EBOOK_NOT_BORROWED: u64 = 2;

    /// Each book is uniquely identified
    struct Book has store, copy, drop {
        id: u64,
        title: string::String,
        author: string::String,
        image_url: string::String,
        available: bool,
    }

    /// Track borrowed and returned book IDs per student
    struct UserLibrary has key, store {
        borrowed: vector<u64>,
        returned: vector<u64>,
    }

    /// Global store of books: id -> Book, and vector of book_ids for iteration
    struct BookStore has key {
        books: table::Table<u64, Book>,
        next_id: u64,
        book_ids: vector<u64>,
    }

    /// Mapping from account address -> UserLibrary
    struct UserLibraryStore has key {
        users: table::Table<address, UserLibrary>,
    }

    /// Initialize the book store
    public entry fun init_store(account: &signer) {
        let store = BookStore {
            books: table::new<u64, Book>(),
            next_id: 1,
            book_ids: vector::empty<u64>(),
        };
        move_to(account, store);

        let user_store = UserLibraryStore {
            users: table::new<address, UserLibrary>(),
        };
        move_to(account, user_store);
    }

    /// Add a new book (admin only)
    public entry fun add_book(account: &signer, title: string::String, author: string::String, image_url: string::String) acquires BookStore{
        let store = borrow_global_mut<BookStore>(signer::address_of(account));
        let id = store.next_id;

        let book = Book {
            id,
            title,
            author,
            image_url,
            available: true,
        };

        table::add(&mut store.books, id, book);
        vector::push_back(&mut store.book_ids, id);
        store.next_id = id + 1;
    }

    /// Borrow a book
    public entry fun borrow_book(account: &signer, owner: address, book_id: u64) acquires BookStore, UserLibraryStore{
        let store = borrow_global_mut<BookStore>(owner);
        let book = table::borrow_mut(&mut store.books, book_id);
        assert!(book.available, EBOOK_UNAVAILABLE); // already borrowed

        let user_store = borrow_global_mut<UserLibraryStore>(owner);
        let user_address = signer::address_of(account);
        let user = get_or_create_user(&mut user_store.users, user_address);

        book.available = false;
        vector::push_back(&mut user.borrowed, book_id);
    }

    /// Return a book
    public entry fun return_book(account: &signer, owner: address, book_id: u64) acquires BookStore, UserLibraryStore{
        let store = borrow_global_mut<BookStore>(owner);
        let book = table::borrow_mut(&mut store.books, book_id);

        let user_store = borrow_global_mut<UserLibraryStore>(owner);
        let user_address = signer::address_of(account);
        let user = get_or_create_user(&mut user_store.users, user_address);

        let len = vector::length(&user.borrowed);
        let  i = 0;
        let  found = false;

        while (i < len) {
            let b_id = vector::borrow(&user.borrowed, i);
            if (*b_id == book_id) {
                found = true;
                break;
            };
            i = i + 1;
        };
        assert!(found, EBOOK_NOT_BORROWED);
        _= vector::remove(&mut user.borrowed, i);

        book.available = true;
        vector::push_back(&mut user.returned, book_id);
    }

    /// Get all books (returns a vector of Book)
    public fun get_all_books(owner: address): vector<Book> acquires BookStore{
        let store = borrow_global<BookStore>(owner);
        let  result = vector::empty<Book>();
        let ids = &store.book_ids;
        let len = vector::length(ids);
        let  i = 0;

        while (i < len) {
            let id = *vector::borrow(ids, i);
            let book = table::borrow(&store.books, id);
            vector::push_back(&mut result, *book);
            i = i + 1;
        };

        result
    }

    /// Get user borrowed and returned book IDs
    public fun get_user_data(owner: address, user: address): (vector<u64>, vector<u64>)acquires UserLibraryStore {
        let user_store = borrow_global<UserLibraryStore>(owner);
        let lib = table::borrow(&user_store.users, user);
        (lib.borrowed, lib.returned)
    }

    /// Get or create a user
    fun get_or_create_user(users: &mut table::Table<address, UserLibrary>, user: address): &mut UserLibrary {
        if (!table::contains(users, user)) {
            let new_user = UserLibrary {
                borrowed: vector::empty<u64>(),
                returned: vector::empty<u64>(),
            };
            table::add(users, user, new_user);
        };
        table::borrow_mut(users, user)
    }
}
