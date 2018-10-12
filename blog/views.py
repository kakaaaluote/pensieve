from datetime import date
from django.shortcuts import render, get_object_or_404
from django.views import generic
from django.views.generic.base import TemplateView

from .models import Blog, BlogAuthor, BlogComment


def index(request):
    """
    View function for home page of site.
    """
    
    blog_num = Blog.objects.all().count()
    blog_author_num = BlogAuthor.objects.all().count()

    return render(
        request,
        'index.html',
        context={
            'blog_num': blog_num,
            'blog_author_num': blog_author_num
        }
    )


class BlogListView(generic.ListView):
    """
    The generic class-based view for list of all blogs.
    """

    model = Blog
    paginate_by = 10


class BlogDetailView(generic.DetailView):
    """
    Class-based view for one particular blog.
    """

    context_object_name = "blog"

    def get_queryset(self):
        post_date = date(self.kwargs['year'], self.kwargs['month'], self.kwargs['day'])
        return Blog.objects.filter(post_date=post_date, slug=self.kwargs['slug'])

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        post_date = date(self.kwargs['year'], self.kwargs['month'], self.kwargs['day'])
        blog = get_object_or_404(Blog, post_date=post_date, slug=self.kwargs['slug'])
        comment_number = BlogComment.objects.filter(blog=blog).count()
        context['comment_number'] = comment_number
        return context


class BlogAuthorListView(generic.ListView):
    """
    The generic class-based view for list of all blog-authors.
    """

    model = BlogAuthor


class BlogAuthorDetailView(generic.DetailView):
    """
    Class-based detail view for one particular blog-author.
    """

    model = BlogAuthor


class AboutThisBlogView(TemplateView):
    """
    Template view for the template of blog website introduction.
    """

    template_name = 'about_this_blog.html'



class AboutMeView(TemplateView):
    """
    Template view for the template of self-introduction.
    """

    template_name = 'about_me.html'
