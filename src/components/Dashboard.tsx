import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom"; // Importing necessary components and icons
import { 
  BookOpen, 
  Search, 
  Calendar, 
  Clock, 
  Star, 
  CheckCircle,
  AlertCircle,
  TrendingUp
} from "lucide-react";

interface Book {
  id: string;
  title: string;
  author: string;
  image: string;
  dueDate?: string;
  returnDate?: string;
  status: 'borrowed' | 'returned' | 'available' | 'unavailable';
  rating?: number;
  category: string;
}

const Dashboard = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const Navigate = useNavigate();

  const borrowedBooks: Book[] = [
    {
      id: "1",
      title: "Introduction to Computer Science",
      author: "David J. Malan",
      image: "📚",
      dueDate: "2024-08-15",
      status: "borrowed",
      category: "Computer Science"
    },
    {
      id: "2", 
      title: "Calculus: Early Transcendentals",
      author: "James Stewart",
      image: "📖",
      dueDate: "2024-08-20",
      status: "borrowed",
      category: "Mathematics"
    }
  ];

  const returnedBooks: Book[] = [
    {
      id: "3",
      title: "The Art of War",
      author: "Sun Tzu",
      image: "📜",
      returnDate: "2024-07-28",
      status: "returned",
      rating: 5,
      category: "Philosophy"
    },
    {
      id: "4",
      title: "Digital Design and Computer Architecture", 
      author: "David Harris",
      image: "💻",
      returnDate: "2024-07-25",
      status: "returned",
      rating: 4,
      category: "Computer Science"
    }
  ];

  const recommendedBooks: Book[] = [
    {
      id: "5",
      title: "Clean Code",
      author: "Robert C. Martin",
      image: "🔧",
      status: "available",
      rating: 5,
      category: "Programming"
    },
    {
      id: "6",
      title: "Linear Algebra and Its Applications",
      author: "Gilbert Strang",
      image: "📊",
      status: "available", 
      rating: 4,
      category: "Mathematics"
    },
    {
      id: "7",
      title: "The Pragmatic Programmer",
      author: "David Thomas",
      image: "🚀",
      status: "unavailable",
      rating: 5,
      category: "Programming"
    }
  ];

  const searchResults: Book[] = [
    {
      id: "8",
      title: "Data Structures and Algorithms",
      author: "Michael T. Goodrich",
      image: "🗂️",
      status: "available",
      category: "Computer Science"
    },
    {
      id: "9",
      title: "Operating System Concepts",
      author: "Abraham Silberschatz",
      image: "⚙️", 
      status: "available",
      category: "Computer Science"
    },
    {
      id: "10",
      title: "Machine Learning Yearning",
      author: "Andrew Ng",
      image: "🤖",
      status: "unavailable",
      category: "AI/ML"
    }
  ];

  const filteredSearchResults = searchResults.filter(book =>
    book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
    book.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusBadge = (status: Book['status']) => {
    switch (status) {
      case 'borrowed':
        return <Badge variant="secondary" className="bg-secondary-warm"><Clock className="w-3 h-3 mr-1" />Borrowed</Badge>;
      case 'returned':
        return <Badge variant="default" className="bg-accent-sage text-foreground"><CheckCircle className="w-3 h-3 mr-1" />Returned</Badge>;
      case 'available':
        return <Badge variant="default" className="bg-primary text-primary-foreground">●Available</Badge>;
      case 'unavailable':
        return <Badge variant="destructive"><AlertCircle className="w-3 h-3 mr-1" />●Unavailable</Badge>;
      default:
        return null;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star 
        key={i} 
        className={`w-4 h-4 ${i < rating ? 'fill-secondary-warm text-secondary-warm' : 'text-muted'}`} 
      />
    ));
  };

  return (
    <div className="min-h-screen bg-gradient-subtle p-6">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8 animate-fade-up">
          <h1 className="text-4xl font-bold mb-2">Library Dashboard</h1>
          {/* Btton */}
          <div className="absolute top-4 right-4 z-50">
  <Button
    variant="connect"
    size="xl"
    className="group"
onClick={async () => {
  try {
    await window.aptos.disconnect();
    alert("Wallet disconnected successfully.");
    Navigate("/"); // Redirect to home or landing page
  } catch (error) {
    console.error("Failed to disconnect wallet:", error);
    alert("Failed to disconnect wallet.");
  }
}}
  >
    Disconnect Wallet
  </Button>
</div>

          <p className="text-muted-foreground text-lg">Manage your academic resources and discover new knowledge</p>
        </div>

        {/* Search Section */}
        <Card className="library-card mb-8 animate-fade-up">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="w-5 h-5" />
              Search Books
            </CardTitle>
            <CardDescription>Find books by title, author, or category</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search for books..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-12"
              />
            </div>
            
            {searchQuery && (
              <div className="mt-6 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredSearchResults.map((book) => (
                  <Card key={book.id} className="hover:shadow-elegant transition-[var(--transition-smooth)]">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="text-3xl">{book.image}</div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-sm truncate">{book.title}</h4>
                          <p className="text-xs text-muted-foreground truncate">{book.author}</p>
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-xs text-muted-foreground">{book.category}</span>
                            {getStatusBadge(book.status)}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Borrowed Books */}
          <Card className="library-card animate-slide-in-left">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                Borrowed Books ({borrowedBooks.length})
              </CardTitle>
              <CardDescription>Currently checked out books with due dates</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {borrowedBooks.map((book) => (
                <div key={book.id} className="flex items-center gap-4 p-4 bg-muted/30 rounded-lg">
                  <div className="text-3xl">{book.image}</div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold truncate">{book.title}</h4>
                    <p className="text-sm text-muted-foreground truncate">{book.author}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Calendar className="w-3 h-3" />
                      <span className="text-xs">Due: {book.dueDate && formatDate(book.dueDate)}</span>
                    </div>
                  </div>
                  {getStatusBadge(book.status)}
                </div>
              ))}
              {borrowedBooks.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <BookOpen className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>No borrowed books</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Returned Books */}
          <Card className="library-card animate-slide-in-right">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                Recently Returned ({returnedBooks.length})
              </CardTitle>
              <CardDescription>Books you've returned with your ratings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {returnedBooks.map((book) => (
                <div key={book.id} className="flex items-center gap-4 p-4 bg-accent/30 rounded-lg">
                  <div className="text-3xl">{book.image}</div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold truncate">{book.title}</h4>
                    <p className="text-sm text-muted-foreground truncate">{book.author}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Calendar className="w-3 h-3" />
                      <span className="text-xs">Returned: {book.returnDate && formatDate(book.returnDate)}</span>
                    </div>
                    {book.rating && (
                      <div className="flex items-center gap-1 mt-1">
                        {renderStars(book.rating)}
                      </div>
                    )}
                  </div>
                  {getStatusBadge(book.status)}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Recommended Books */}
        <Card className="library-card animate-fade-up">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Recommended for You
            </CardTitle>
            <CardDescription>Curated book suggestions based on your reading history</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommendedBooks.map((book) => (
                <Card key={book.id} className="hover:shadow-elegant transition-[var(--transition-smooth)]">
                  <CardContent className="p-4">
                    <div className="text-center mb-4">
                      <div className="text-4xl mb-2">{book.image}</div>
                      <h4 className="font-semibold text-sm leading-tight mb-1">{book.title}</h4>
                      <p className="text-xs text-muted-foreground">{book.author}</p>
                    </div>
                    
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs text-muted-foreground">{book.category}</span>
                      {book.rating && (
                        <div className="flex items-center gap-1">
                          {renderStars(book.rating)}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between">
                      {getStatusBadge(book.status)}
                      <Button size="sm" variant={book.status === 'available' ? 'default' : 'ghost'}>
                        {book.status === 'available' ? 'Borrow' : 'Join Waitlist'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;