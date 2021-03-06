# Generated by Django 2.1.1 on 2018-10-04 03:31

import datetime
from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Blog',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('post_date', models.DateField(default=datetime.date.today)),
                ('title', models.CharField(help_text='Title of this blog.', max_length=50)),
                ('content', models.TextField()),
            ],
        ),
        migrations.CreateModel(
            name='BlogAuthor',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('biography', models.TextField()),
                ('name', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='BlogComment',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('post_date', models.DateTimeField(auto_now_add=True)),
                ('content', models.TextField(max_length=500)),
                ('blog', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='blog.Blog')),
                ('comment_author', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='Tag',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('tag', models.CharField(help_text='Define a tag.', max_length=20)),
            ],
        ),
        migrations.AddField(
            model_name='blog',
            name='blog_author',
            field=models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='blog.BlogAuthor'),
        ),
        migrations.AddField(
            model_name='blog',
            name='tags',
            field=models.ManyToManyField(to='blog.Tag'),
        ),
    ]
