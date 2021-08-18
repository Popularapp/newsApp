var express = require('express');
var router = express.Router();
const crypto = require('crypto');
var fs = require('fs-extra');

var common = require('./common');

/*Import databases*/
var mysqlconnection = require('../database/connection');

const generateAuthToken = () => {
    return crypto.randomBytes(30).toString('hex');
}

const authTokens = {};


router.use((req, res, next) => {
    const authToken = req.cookies['AuthToken'];
    // console.log(req.cookies['User Filter']);
    req.user_filter = [{state:[],city:[],district:[]}];
    if(req.cookies['Updated User Filter With District1'] != undefined){
        req.user_filter = req.cookies['Updated User Filter With District1'];
    }

    // console.log(req.user_filter);
    // Inject the user to the request
    req.user = authTokens[authToken];
    // console.log(req.user);
    // req.user = {
    //   full_name: 'Aabhas',
    //   password: 'CDbaFvDLNXdg6nAuqTE3mxmqfYA3',
    //   phone: '+918269253234',
    //   city: 'Bhilwara',
    //   user_id: 52
    // }

    next();
});

// router.get('/test', function(req, res, next) {
//     res.render('screens/test');
// });

/* GET home page. */
router.get('/', function(req, res, next) {
    var sql2 = "SELECT * FROM `ads` WHERE status = 1 ORDER BY `order`";
    mysqlconnection.query(sql2,function(err,ads){
        if(ads != undefined){
            if(ads.length != 0){
                res.render('screens/ads.ejs',{
                    ads:ads,
                    title:common.title,
                    imageReplacer:common.imageReplacer,
                    website:common.website,
                    appId:common.appId,
                    class1:common.class1,
                    class2:common.class2,
                    favicon:common.favicon
                });
            } else {
                res.redirect('/news');
            }
        } else {
            res.send('Database Not connected');
        }
    });
});

router.get('/contact-us', function(req, res, next) {
    if(req.user){
        var logged_in = 1;
    } else {
        var logged_in = 0;
    }

    // console.log(common.logo_path);
    var sql8 = "SELECT * FROM `logo` WHERE `website` = '"+ common.logo_path +"'";
    // console.log(sql8);
    mysqlconnection.query(sql8,function(err,logo){
        // console.log(err);
        if(logo != undefined){
            res.render('screens/contact-us.ejs',{
                logo:logo,
                logged_in:logged_in,
                title:common.title,
                imageReplacer:common.imageReplacer,
                website:common.website,
                appId:common.appId,
                class1:common.class1,
                class2:common.class2,
                favicon:common.favicon
            });
        } else {
            res.send('Database Not connected');
        }
    });
});

router.get('/search', function(req, res, next) {
    if(req.user){
        var logged_in = 1;
    } else {
        var logged_in = 0;
    }
    var sql = "SELECT * FROM `categories` WHERE status = 1 AND name <> 'NULL'";
    // var sql1 = "SELECT * FROM `states` WHERE `country_id` = 101";
    var sql1 = "SELECT `sub-categories`.* FROM `sub-categories` INNER JOIN `categories` ON `categories`.`id` = `sub-categories`.`category_id` WHERE `sub-categories`.`status` = 1 AND `sub-categories`.`name` <> 'NULL' AND `categories`.`is_state` = 1";
    // var sql2 = "SELECT * FROM `cities` WHERE `state_id` BETWEEN 1 AND 41";
    var sql8 = "SELECT * FROM `logo` WHERE `website` = '"+ common.logo_path +"'";
    mysqlconnection.query(sql,function(err,categories){
        mysqlconnection.query(sql1,function(err,states){
            // mysqlconnection.query(sql2,function(err,cities){
            mysqlconnection.query(sql8,function(err,logo){
                // console.log(states);
                if(categories != undefined){
                    res.render('screens/search',{
                        categories:categories,
                        states:states,
                        // cities:cities,
                        logo:logo,
                        logged_in:logged_in,
                        title:common.title,
                        imageReplacer:common.imageReplacer,
                        website:common.website,
                        appId:common.appId,
                        class1:common.class1,
                        class2:common.class2,
                        favicon:common.favicon
                    });
                } else {
                    res.send('Database Not connected');
                }
            });
            // });
        });
    });
});


router.get('/images/slider_images/:path', function(req, res, next) {
    var path = req.params.path;
    var folder = 'slider_images';
    res.render('screens/images',{
        path:path,
        folder:folder,
        news_id:'',
        title:common.title,
        imageReplacer:common.imageReplacer,
        website:common.website,
        appId:common.appId,
        class1:common.class1,
        class2:common.class2,
        favicon:common.favicon
    });
});

router.get('/images/image_files/:news_id/:path', function(req, res, next) {
    var path = req.params.path;
    var news_id = req.params.news_id;
    var folder = 'image_files';
    res.render('screens/images',{
        path:path,
        folder:folder,
        news_id:news_id,
        title:common.title,
        imageReplacer:common.imageReplacer,
        website:common.website,
        appId:common.appId,
        class1:common.class1,
        class2:common.class2,
        favicon:common.favicon
    });
});

router.get('/images/directory_images/:news_id/:path', function(req, res, next) {
    var path = req.params.path;
    var news_id = req.params.news_id;
    var folder = 'directory_images';
    res.render('screens/images',{
        path:path,
        folder:folder,
        news_id:news_id,
        title:common.title,
        imageReplacer:common.imageReplacer,
        website:common.website,
        appId:common.appId,
        class1:common.class1,
        class2:common.class2,
        favicon:common.favicon
    });
});


router.get('/images/news_files/:news_id/:path', function(req, res, next) {
    var path = req.params.path;
    var news_id = req.params.news_id;
    var folder = 'news_files';
    res.render('screens/images',{
        path:path,
        folder:folder,
        news_id:news_id,
        title:common.title,
        imageReplacer:common.imageReplacer,
        website:common.website,
        appId:common.appId,
        class1:common.class1,
        class2:common.class2,
        favicon:common.favicon
    });
});

router.get('/epaper', function(req, res, next) {
    if(req.user){
        var logged_in = 1;
    } else {
        var logged_in = 0;
    }
    var sql4 = "SELECT `id` FROM `e-paper` WHERE `status` = 1 ORDER BY `created_at` DESC";
    var sql3 = "SELECT * FROM `epaper-category` WHERE `status` = 1 ORDER BY `id` DESC";
    var sql8 = "SELECT * FROM `logo` WHERE `website` = '"+ common.logo_path +"'";
    mysqlconnection.query(sql3,function(err,epaperCategory){
        mysqlconnection.query(sql8,function(err,logo){
            mysqlconnection.query(sql4,function(err,epaper){
                if(epaper != undefined){
                    res.render('screens/epaper',{
                        epaperCategory:epaperCategory,
                        logo:logo,
                        epaper:epaper,
                        logged_in:logged_in,
                        title:common.title,
                        imageReplacer:common.imageReplacer,
                        website:common.website,
                        appId:common.appId,
                        class1:common.class1,
                        class2:common.class2,
                        favicon:common.favicon
                    });
                } else {
                    res.send('Database Not connected');
                }
            });
        });
    });
});

router.get('/pdf/:epaper_id', function(req, res, next) {
    if(req.user){
        var logged_in = 1;
    } else {
        var logged_in = 0;
    }
    var epaper_id = req.params.epaper_id;
    var sql3 = "SELECT * FROM `epaper_images` WHERE `epaper_id` = '"+epaper_id+"'";
    var sql4 = "SELECT * FROM `e-paper` WHERE `id` = '"+ epaper_id +"'";
    var sql8 = "SELECT * FROM `logo` WHERE `website` = '"+ common.logo_path +"'";
    mysqlconnection.query(sql3,function(err,epaper){
        mysqlconnection.query(sql8,function(err,logo){
            mysqlconnection.query(sql4,function(err,epaper_views){
                if(epaper != undefined){
                    // console.log(epaper);
                    res.render('screens/pdf',{
                        epaper:epaper,
                        logo:logo,
                        logged_in:logged_in,
                        title:common.title,
                        imageReplacer:common.imageReplacer,
                        website:common.website,
                        appId:common.appId,
                        class1:common.class1,
                        class2:common.class2,
                        favicon:common.favicon,
                        epaper_views:epaper_views
                    });
                } else {
                    res.send('Database Not connected');
                }
            });
        });
    });
});

router.get('/getEpaper/:id', function(req, res, next) {
    var epaper_id = req.params.id;
    var sql = "SELECT `e-paper`.* , `epaper_images`.`path` ,`epaper-category`.`id` AS category FROM `e-paper` INNER JOIN `epaper_images` ON `epaper_images`.`epaper_id` = `e-paper`.`id` INNER JOIN `epaper-category` ON `epaper-category`.`name` = `e-paper`.`category` WHERE `e-paper`.`id` = '"+epaper_id+"' ORDER BY `e-paper`.`created_at` DESC LIMIT 1";
    mysqlconnection.query(sql,function(err,news){
        res.jsonp(news);
    });
});

router.get('/states/:state', function(req, res, next) {
    if(req.user){
        var logged_in = 1;
    } else {
        var logged_in = 0;
    }
    var state = req.params.state;
    var sql1 = "SELECT * FROM `categories` WHERE `status` = 1 AND `name` <> 'NULL' ORDER BY `order`";
    var sql4 = "SELECT * FROM `sub-categories` WHERE `status` = 1 AND `name` <> 'NULL'";
    var sql2 = "SELECT * FROM `slider` WHERE status = 1 AND category = 'main' ORDER BY `order`";
    var sql8 = "SELECT * FROM `logo` WHERE `website` = '"+ common.logo_path +"'";
    var sql = "SELECT `news`.*,`categories`.`name` AS c_name,`categories`.`headingColor` AS hcolor,`sub-categories`.`name` AS sc_name, `users`.`nickname` AS u_name FROM `news` INNER JOIN `categories` ON `categories`.`id` = `news`.`category_id` INNER JOIN `sub-categories` ON `sub-categories`.`id` =`news`.`sub_category_id` INNER JOIN `users` ON `users`.`user_id` =`news`.`user_id` WHERE `news`.`is_approved` = 1 AND `news`.`status` = 1 AND `news`.`state` = '"+ state +"' ORDER By `news`.`news_id` DESC LIMIT 10 OFFSET 0";
    mysqlconnection.query(sql1,function(err,categories){
        mysqlconnection.query(sql2,function(err,slider){
            mysqlconnection.query(sql8,function(err,logo){
                mysqlconnection.query(sql4,function(err,subCategories){
                    mysqlconnection.query(sql,function(err,news){
                        if(news != undefined){
                            res.render('screens/state',{
                                categories:categories,
                                slider:slider,
                                logo:logo,
                                subCategories:subCategories,
                                news2:news,
                                state:state,
                                logged_in:logged_in,
                                title:common.title,
                                imageReplacer:common.imageReplacer,
                                website:common.website,
                                appId:common.appId,
                                class1:common.class1,
                                class2:common.class2,
                                favicon:common.favicon
                            });
                        } else {
                            res.send('Database Not connected');
                        }
                    });
                });
            });
        });
    });
});

router.get('/city/:city', function(req, res, next) {
    if(req.user){
        var logged_in = 1;
    } else {
        var logged_in = 0;
    }
    var city = req.params.city;
    var sql1 = "SELECT * FROM `categories` WHERE `status` = 1 AND `name` <> 'NULL' ORDER BY `order`";
    var sql4 = "SELECT * FROM `sub-categories` WHERE `status` = 1 AND `name` <> 'NULL'";
    var sql2 = "SELECT * FROM `slider` WHERE status = 1 AND category = 'main' ORDER BY `order`";
    var sql8 = "SELECT * FROM `logo` WHERE `website` = '"+ common.logo_path +"'";
    var sql = "SELECT `news`.*,`categories`.`name` AS c_name,`categories`.`headingColor` AS hcolor,`sub-categories`.`name` AS sc_name, `users`.`nickname` AS u_name FROM `news` INNER JOIN `categories` ON `categories`.`id` = `news`.`category_id` INNER JOIN `sub-categories` ON `sub-categories`.`id` =`news`.`sub_category_id` INNER JOIN `users` ON `users`.`user_id` =`news`.`user_id` WHERE `news`.`is_approved` = 1 AND `news`.`status` = 1 AND `sub-categories`.`name` = '"+ city +"' ORDER By `news`.`news_id` DESC LIMIT 10 OFFSET 0";
    mysqlconnection.query(sql1,function(err,categories){
        mysqlconnection.query(sql2,function(err,slider){
            mysqlconnection.query(sql8,function(err,logo){
                mysqlconnection.query(sql4,function(err,subCategories){
                    mysqlconnection.query(sql,function(err,news){
                        if(news != undefined){
                            res.render('screens/city',{
                                categories:categories,
                                slider:slider,
                                logo:logo,
                                subCategories:subCategories,
                                news2:news,
                                state:city,
                                logged_in:logged_in,
                                title:common.title,
                                imageReplacer:common.imageReplacer,
                                website:common.website,
                                appId:common.appId,
                                class1:common.class1,
                                class2:common.class2,
                                favicon:common.favicon
                            });
                        } else {
                            res.send('Database Not connected');
                        }
                    });
                });
            });
        });
    });
});

router.get('/each-news/:news_id', function(req, res, next) {
    var news_id = req.params.news_id;
    var sql8 = "SELECT * FROM `logo` WHERE `website` = '"+ common.logo_path +"'";
    var sql = "SELECT `news`.*,`categories`.`name` AS c_name,`categories`.`headingColor` AS hcolor,`sub-categories`.`name` AS sc_name,`users`.`nickname` AS u_name ,`users`.`city` AS news_city FROM `news` INNER JOIN `categories` ON `categories`.`id` = `news`.`category_id` INNER JOIN `sub-categories` ON `sub-categories`.`id` = `news`.`sub_category_id` INNER JOIN `users` ON `users`.`user_id` = `news`.`user_id` WHERE `news`.`news_id` = '" + news_id + "'";
    var sql2 = "SELECT * FROM `images` WHERE news_id = '"+news_id+"'";
    var sql3 = "SELECT * FROM `videos` WHERE news_id = '"+news_id+"'";
    var sql1 = "SELECT * FROM `categories` WHERE `status` = 1 AND `name` <> 'NULL' AND `is_state` = 0 ORDER BY `order`";
    var sql6 = "SELECT * FROM `sub-categories` WHERE `status` = 1 AND `name` <> 'NULL'";
    var sql5 = "SELECT * FROM `slider` WHERE status = 1 AND category = 'inside' ORDER BY `order`";
    mysqlconnection.query(sql,function(err,news){
        mysqlconnection.query(sql2,function(err,images){
            mysqlconnection.query(sql3,function(err,videos){
                // console.log(news[0].sc_name);
                // console.log(news[0].c_name);
                if(news[0].sc_name != null){
                    // console.log(news[0].sc_name);
                    var split1 = news[0].sc_name.split('(');
                    // console.log(split1);
                    if(split1[1] == undefined){
                        var search_name = split1[0];
                    } else {
                        var search_name = (news[0].sc_name.split('(')[1]).split(')')[0];
                    }
                    var sql4 = "SELECT `news`.*,`categories`.`name` AS c_name,`categories`.`headingColor` AS hcolor,`sub-categories`.`name` AS sc_name FROM `news` INNER JOIN `categories` ON `categories`.`id` = `news`.`category_id` INNER JOIN `sub-categories` ON `sub-categories`.`id` = `news`.`sub_category_id` WHERE `news`.`is_approved` = 1 AND `news`.`status` = 1 AND `news`.`sub_category_id` = '"+ news[0].sub_category_id +"' AND `news`.`news_id` <> '"+ news[0].news_id +"' AND `sub-categories`.`name` LIKE '"+ ('%' + search_name + '%') +"' ORDER By `news`.`news_id` DESC LIMIT 20 OFFSET 0";
                } else {
                    // console.log(news[0].sc_name);
                    var sql4 = "SELECT `news`.*,`categories`.`name` AS c_name,`categories`.`headingColor` AS hcolor,`sub-categories`.`name` AS sc_name FROM `news` INNER JOIN `categories` ON `categories`.`id` = `news`.`category_id` INNER JOIN `sub-categories` ON `sub-categories`.`id` = `news`.`sub_category_id` WHERE `news`.`is_approved` = 1 AND `news`.`status` = 1 AND `news`.`sub_category_id` = '"+ news[0].sub_category_id +"' AND `news`.`news_id` <> '"+ news[0].news_id +"' AND `sub-categories`.`name` LIKE '"+ ('%' + news[0].c_name + '%') +"' ORDER By `news`.`news_id` DESC LIMIT 20 OFFSET 0";
                }
                var sql9 = "SELECT * FROM `user_profile` WHERE `user_id` = '"+news[0].user_id+"'";
                mysqlconnection.query(sql4,function(err,news2){
                    mysqlconnection.query(sql8,function(err,logo){
                        mysqlconnection.query(sql1,function(err,categories){
                            mysqlconnection.query(sql5,function(err,slider){
                                mysqlconnection.query(sql6,function(err,subCategories){
                                    mysqlconnection.query(sql9,function(err,user_profile){
                                        if(news != undefined){
                                            res.render('screens/each-news',{
                                                news:news,
                                                images:images,
                                                videos:videos,
                                                news2: news2,
                                                logo:logo,
                                                categories:categories,
                                                subCategories:subCategories,
                                                slider:slider,
                                                user_profile:user_profile,
                                                title:common.title,
                                                imageReplacer:common.imageReplacer,
                                                website:common.website,
                                                appId:common.appId,
                                                class1:common.class1,
                                                class2:common.class2,
                                                favicon:common.favicon
                                            });
                                        } else {
                                            res.send('Database Not connected');
                                        }
                                    });
                                });
                            });
                        });
                    });
                });
            });
        });
    });
});

router.get('/getPosts/:offset', function(req, res, next) {
    var o = req.params.offset;
    var sql = "SELECT `posts`.*,`dcategory`.`name` AS c_name,`categories`.`headingColor` AS hcolor, `users`.`nickname` AS u_name FROM `posts` INNER JOIN `dcategory` ON `dcategory`.`id` = `posts`.`category_id` INNER JOIN `users` ON `users`.`user_id` =`posts`.`user_id` WHERE `posts`.`is_approved` = 1 AND `posts`.`status` = 1 ORDER By `posts`.`posts_id` DESC LIMIT 10 OFFSET "+o+"";
    mysqlconnection.query(sql,function(err,news){
        res.jsonp(news);
    });
});

router.get('/getCategoryNews/:offset/:category_id', function(req, res, next) {
    var o = req.params.offset;
    var category_id = req.params.category_id;
    var sql = "SELECT `news`.*,`categories`.`name` AS c_name,`categories`.`headingColor` AS hcolor,`sub-categories`.`name` AS sc_name, `users`.`nickname` AS u_name FROM `news` INNER JOIN `categories` ON `categories`.`id` = `news`.`category_id` INNER JOIN `sub-categories` ON `sub-categories`.`id` =`news`.`sub_category_id` INNER JOIN `users` ON `users`.`user_id` =`news`.`user_id` WHERE `news`.`is_approved` = 1 AND `news`.`status` = 1 AND `news`.`category_id` = '"+ category_id +"' ORDER By `news`.`news_id` DESC LIMIT 10 OFFSET "+o+"";
    mysqlconnection.query(sql,function(err,news){
        res.jsonp(news);
    });
});

router.get('/getSimiliarNews/:sub_category_id/:offset', function(req, res, next) {
    var o = req.params.offset;
    var sub_category_id = req.params.sub_category_id;
    // console.log(sub_category_id);
    var split1 = sub_category_id.split('(');
    // console.log(split1);
    if(split1[1] == undefined){
        var search_name = split1[0];
    } else {
        var search_name = (sub_category_id.split('(')[1]).split(')')[0];
    }
    // console.log(search_name);
    var sql = "SELECT `news`.*,`categories`.`name` AS c_name,`categories`.`headingColor` AS hcolor,`sub-categories`.`name` AS sc_name, `users`.`nickname` AS u_name FROM `news` INNER JOIN `categories` ON `categories`.`id` = `news`.`category_id` INNER JOIN `sub-categories` ON `sub-categories`.`id` =`news`.`sub_category_id` INNER JOIN `users` ON `users`.`user_id` =`news`.`user_id` WHERE `news`.`is_approved` = 1 AND `news`.`status` = 1 AND `sub-categories`.`name` LIKE '"+ ('%' + search_name + '%') +"' ORDER By `news`.`news_id` DESC LIMIT 20 OFFSET "+o+"";
    mysqlconnection.query(sql,function(err,news){
        res.jsonp(news);
    });
});

router.get('/getStateNews/:offset/:state', function(req, res, next) {
    var o = req.params.offset;
    var state = req.params.state;
    var sql = "SELECT `news`.*,`categories`.`name` AS c_name,`categories`.`headingColor` AS hcolor,`sub-categories`.`name` AS sc_name, `users`.`nickname` AS u_name FROM `news` INNER JOIN `categories` ON `categories`.`id` = `news`.`category_id` INNER JOIN `sub-categories` ON `sub-categories`.`id` =`news`.`sub_category_id` INNER JOIN `users` ON `users`.`user_id` =`news`.`user_id` WHERE `news`.`is_approved` = 1 AND `news`.`status` = 1 AND `news`.`state` = '"+ state +"' ORDER By `news`.`news_id` DESC LIMIT 10 OFFSET "+o+"";
    mysqlconnection.query(sql,function(err,news){
        res.jsonp(news);
    });
});

router.get('/getCityNews/:offset/:city', function(req, res, next) {
    var o = req.params.offset;
    var city = req.params.city;
    var sql = "SELECT `news`.*,`categories`.`name` AS c_name,`categories`.`headingColor` AS hcolor,`sub-categories`.`name` AS sc_name, `users`.`nickname` AS u_name FROM `news` INNER JOIN `categories` ON `categories`.`id` = `news`.`category_id` INNER JOIN `sub-categories` ON `sub-categories`.`id` =`news`.`sub_category_id` INNER JOIN `users` ON `users`.`user_id` =`news`.`user_id` WHERE `news`.`is_approved` = 1 AND `news`.`status` = 1 AND `sub-categories`.`name` = '"+ city +"' ORDER By `news`.`news_id` DESC LIMIT 10 OFFSET "+o+"";
    mysqlconnection.query(sql,function(err,news){
        res.jsonp(news);
    });
});

router.get('/videos', function(req, res, next) {
    if(req.user){
        var logged_in = 1;
    } else {
        var logged_in = 0;
    }
    var sql3 = "SELECT `videos`.*,`news`.*,`categories`.`name` AS c_name,`categories`.`headingColor` AS hcolor,`sub-categories`.`name` AS sc_name  FROM `videos` INNER JOIN `news` ON `news`.`news_id` = `videos`.`news_id` INNER JOIN `categories` ON `categories`.`id` = `news`.`category_id` INNER JOIN `sub-categories` ON `sub-categories`.`id` =`news`.`sub_category_id` WHERE `news`.`is_approved` = 1 AND `news`.`status` = 1 ORDER BY `videos`.`id` DESC LIMIT 1 OFFSET 0";
    var sql8 = "SELECT * FROM `logo` WHERE `website` = '"+ common.logo_path +"'";
    mysqlconnection.query(sql3,function(err,videos){
        mysqlconnection.query(sql8,function(err,logo){
            if(videos != undefined){
                res.render('screens/videos',{
                    videos:videos,
                    logo:logo,
                    logged_in:logged_in,
                    title:common.title,
                    imageReplacer:common.imageReplacer,
                    website:common.website,
                    appId:common.appId,
                    class1:common.class1,
                    class2:common.class2,
                    favicon:common.favicon
                });
            } else {
                res.send('Database Not connected');
            }
        });
    });
});

router.get('/getVideos/:offset', function(req, res, next) {
    var o = req.params.offset;
    var sql3 = "SELECT `videos`.*,`news`.*,`categories`.`name` AS c_name,`categories`.`headingColor` AS hcolor,`sub-categories`.`name` AS sc_name  FROM `videos` INNER JOIN `news` ON `news`.`news_id` = `videos`.`news_id` INNER JOIN `categories` ON `categories`.`id` = `news`.`category_id` INNER JOIN `sub-categories` ON `sub-categories`.`id` =`news`.`sub_category_id` WHERE `news`.`is_approved` = 1 AND `news`.`status` = 1 ORDER BY `videos`.`id` DESC LIMIT 1 OFFSET "+o+"";
    mysqlconnection.query(sql3,function(err,videos){
        res.jsonp(videos);
    });
});

router.get('/getCategoryPost/:category_name/:offset', function(req, res, next) {
    var category_name = req.params.category_name;
    var o = req.params.offset;
    var sql = "SELECT `user_post`.*,`dimages`.`path` FROM `user_post` INNER JOIN `dimages` ON `dimages`.`image_id` = (SELECT `image_id` FROM `dimages` WHERE `dimages`.`posts_id` = `user_post`.`id` LIMIT 1 ) WHERE `user_post`.`status` = 1 AND `user_post`.`is_approved` = 1 AND `user_post`.`website`= '"+common.logo_path+"' AND `user_post`.`category_name` = '"+category_name+"' ORDER BY `user_post`.`created_at` DESC LIMIT 20 OFFSET "+o+"";
    mysqlconnection.query(sql,function(err,data){
        res.jsonp(data);
    });
});

router.get('/getRecommendedPost/:city/:offset', function(req, res, next) {
    var city = req.params.city;
    var o = req.params.offset;
    var sql = "SELECT `user_post`.*,(SELECT `dimages`.`path` FROM `dimages` WHERE `dimages`.`posts_id` = `user_post`.`id` LIMIT 1 OFFSET 0) path FROM `user_post` WHERE `user_post`.`status` = 1 AND `user_post`.`is_approved` = 1 AND `user_post`.`website`= '"+common.logo_path+"' AND `user_post`.`city` = '"+city+"' ORDER BY `user_post`.`created_at` DESC LIMIT 20 OFFSET "+o+"";
    mysqlconnection.query(sql,function(err,data){
        res.jsonp(data);
    });
});

router.get('/getMorePost/:city/:offset', function(req, res, next) {
    var city = req.params.city;
    var o = req.params.offset;
    var sql = "SELECT `user_post`.*,(SELECT `dimages`.`path` FROM `dimages` WHERE `dimages`.`posts_id` = `user_post`.`id` LIMIT 1 OFFSET 0) path FROM `user_post` WHERE `user_post`.`status` = 1 AND `user_post`.`is_approved` = 1 AND `user_post`.`website`= '"+common.logo_path+"' AND `user_post`.`city` <> '"+city+"' ORDER BY `user_post`.`created_at` DESC LIMIT 20 OFFSET "+o+"";
    mysqlconnection.query(sql,function(err,data){
        res.jsonp(data);
    });
});

router.get('/getMorePost/:offset', function(req, res, next) {
    var o = req.params.offset;
    var sql = "SELECT `user_post`.*,(SELECT `dimages`.`path` FROM `dimages` WHERE `dimages`.`posts_id` = `user_post`.`id` LIMIT 1 OFFSET 0) path FROM `user_post` WHERE `user_post`.`status` = 1 AND `user_post`.`is_approved` = 1 AND `user_post`.`website`= '"+common.logo_path+"' ORDER BY `user_post`.`created_at` DESC LIMIT 20 OFFSET "+o+"";
    mysqlconnection.query(sql,function(err,data){
        res.jsonp(data);
    });
});


router.get('/directory', function(req, res, next) {
    if(req.user){
        var logged_in = 1;
        var sql8 = "SELECT * FROM `logo` WHERE `website` = '"+ common.logo_path +"'";
        var sql = "SELECT * FROM `dcategory` WHERE `status` = 1";
        var sql1= "SELECT `user_post`.*,(SELECT `dimages`.`path` FROM `dimages` WHERE `dimages`.`posts_id` = `user_post`.`id` LIMIT 1 OFFSET 0) path FROM `user_post` WHERE `user_post`.`status` = 1 AND `user_post`.`is_approved` = 1 AND `user_post`.`website`= '"+common.logo_path+"' AND `user_post`.`city` = '"+req.user.city+"' ORDER BY `user_post`.`created_at` DESC LIMIT 20 OFFSET 0";
        mysqlconnection.query(sql8,function(err,logo){
            mysqlconnection.query(sql,function(err,dcategory){
                mysqlconnection.query(sql1,function(err,recommended_post){
                    // console.log(recommended_post);
                    if(dcategory != undefined){
                        res.render('screens/directory',{
                            logo:logo,
                            dcategory:dcategory,
                            logged_in:logged_in,
                            recommended_post:recommended_post,
                            city:req.user.city,
                            title:common.title,
                            imageReplacer:common.imageReplacer,
                            website:common.website,
                            appId:common.appId,
                            class1:common.class1,
                            class2:common.class2,
                            favicon:common.favicon
                        });
                    } else {
                        res.send('Database Not connected');
                    }
                });
            });
        });
    } else {
        var logged_in = 0;
        var sql8 = "SELECT * FROM `logo` WHERE `website` = '"+ common.logo_path +"'";
        var sql = "SELECT * FROM `dcategory` WHERE `status` = 1";
        var sql2= "SELECT `user_post`.*,(SELECT `dimages`.`path` FROM `dimages` WHERE `dimages`.`posts_id` = `user_post`.`id` LIMIT 1 OFFSET 0) path FROM `user_post` WHERE `user_post`.`status` = 1 AND `user_post`.`is_approved` = 1 AND `user_post`.`website`= '"+common.logo_path+"' ORDER BY `user_post`.`created_at` DESC LIMIT 20 OFFSET 0";
        console.log(sql2);
        mysqlconnection.query(sql8,function(err,logo){
            mysqlconnection.query(sql,function(err,dcategory){
                mysqlconnection.query(sql2,function(err,more_post){
                    if(dcategory != undefined){
                        res.render('screens/directory',{
                            logo:logo,
                            dcategory:dcategory,
                            logged_in:logged_in,
                            recommended_post:more_post,
                            city:undefined,
                            title:common.title,
                            imageReplacer:common.imageReplacer,
                            website:common.website,
                            appId:common.appId,
                            class1:common.class1,
                            class2:common.class2,
                            favicon:common.favicon
                        });
                    } else {
                        res.send('Database Not connected');
                    }
                });
            });
        });
    }
});

router.get('/user-profile', function(req, res, next) {
    if(req.user){
        var logged_in = 1;
        var sql8 = "SELECT * FROM `logo` WHERE `website` = '"+ common.logo_path +"'";
        var sql2 = "SELECT * FROM `users` WHERE `user_id` = '"+req.user.user_id+"'";
        var sql3 = "SELECT * FROM `states` WHERE `country_id` = 101";
        var sql = "SELECT * FROM `dcategory` WHERE `status` = 1";
        var sql1= "SELECT `user_post`.*,`dimages`.`path` FROM `user_post` INNER JOIN `dimages` ON `dimages`.`image_id` = (SELECT `image_id` FROM `dimages` WHERE `dimages`.`posts_id` = `user_post`.`id` LIMIT 1 ) WHERE `user_post`.`status` = 1 AND `user_post`.`is_approved` = 1 AND `user_post`.`website`= '"+common.logo_path+"' AND `user_post`.`user_id` = '"+req.user.user_id+"' ORDER BY `user_post`.`created_at` DESC";
        mysqlconnection.query(sql8,function(err,logo){
            mysqlconnection.query(sql,function(err,dcategory){
                mysqlconnection.query(sql1,function(err,recommended_post){
                    mysqlconnection.query(sql3,function(err,states){
                        mysqlconnection.query(sql2,function(err,users){
                            if(dcategory != undefined){
                                res.render('screens/user-profile',{
                                    logo:logo,
                                    logged_in:logged_in,
                                    user_post:recommended_post,
                                    city:req.user.city,
                                    dcategory:dcategory,
                                    user:users,
                                    states:states,
                                    title:common.title,
                                    imageReplacer:common.imageReplacer,
                                    website:common.website,
                                    appId:common.appId,
                                    class1:common.class1,
                                    class2:common.class2,
                                    favicon:common.favicon
                                });
                            } else {
                                res.send('Database Not connected');
                            }
                        });
                    });
                });
            });
        });
    } else {
        res.redirect('/login');
    }
});

router.post('/edit-profile/:user_id', function(req, res, next) {
    if(req.user){
        var user_id = req.params.user_id;
        var full_name = req.body.full_name;
        var phone = req.body.phone;
        var city = req.body.city;
        var sql = "UPDATE `users` SET `full_name` = '"+full_name+"',phone = '"+phone+"',city = '"+city+"' WHERE `user_id` = '"+user_id+"'";
        mysqlconnection.query(sql,function(err,user){
            req.user.full_name = full_name;
            req.user.phone = phone;
            req.user.city = city;
            res.redirect('/user-profile');
        });
    } else {
        res.redirect('/login');
    }
});

router.get('/delete-post/:post_id', function(req, res, next) {
    if(req.user){
        var post_id = req.params.post_id;
        var sql = "UPDATE `user_post` SET `status` = 0 WHERE `id` = '"+post_id+"'";
        mysqlconnection.query(sql,function(err,user){
            res.redirect('/user-profile');
        });
    } else {
        res.redirect('/login');
    }
});


router.get('/increaseCount/:news_id', function(req, res, next) {
    var news_id = req.params.news_id;
    var sql = "UPDATE `news` SET `views` = `views` + 1 WHERE `news_id` = '"+news_id+"'";
    mysqlconnection.query(sql,function(err,news){
        res.jsonp(news);
    });
});

router.get('/increaseEpaperCount/:news_id', function(req, res, next) {
    var news_id = req.params.news_id;
    var sql = "UPDATE `e-paper` SET `views` = `views` + 1 WHERE `id` = '"+news_id+"'";
    mysqlconnection.query(sql,function(err,news){
        res.jsonp(news);
    });
});

router.get('/delete-post-image/:id/:path/:post_id', function(req, res, next) {
    if(req.user){
        var id = req.params.id;
        var path = req.params.path;
        var p1 = 'public/directory_images/' + req.params.post_id + '/' + path;
        fs.unlink(p1, function (err) {
            if (err) throw err;
        });
        var sql = "DELETE FROM `dimages` WHERE `image_id` = '"+id+"'";
        mysqlconnection.query(sql,function(err,user){
            res.redirect('/edit-post/' + req.params.post_id);
        });
    } else {
        res.redirect('/login');
    }
});


router.get('/directory/:category_name', function(req, res, next) {
    if(req.user){
        var logged_in = 1;
    } else {
        var logged_in = 0;
    }
    var category_name = req.params.category_name;
    var sql2 = "SELECT `user_post`.*,(SELECT `dimages`.`path` FROM `dimages` WHERE `dimages`.`posts_id` = `user_post`.`id` LIMIT 1 OFFSET 0) path FROM `user_post` WHERE `user_post`.`status` = 1 AND `user_post`.`is_approved` = 1 AND `user_post`.`website`= '"+common.logo_path+"' AND `user_post`.`category_name` = '"+category_name+"' ORDER BY `user_post`.`created_at` DESC LIMIT 20 OFFSET 0";
    var sql8 = "SELECT * FROM `logo` WHERE `website` = '"+ common.logo_path +"'";
    var sql = "SELECT * FROM `dcategory` WHERE `status` = 1";
    mysqlconnection.query(sql8,function(err,logo){
        mysqlconnection.query(sql,function(err,dcategory){
            mysqlconnection.query(sql2,function(err,user_post){
                if(dcategory != undefined){
                    res.render('screens/category-wise',{
                        logo:logo,
                        dcategory:dcategory,
                        user_post:user_post,
                        category_name: category_name,
                        logged_in:logged_in,
                        title:common.title,
                        imageReplacer:common.imageReplacer,
                        website:common.website,
                        appId:common.appId,
                        class1:common.class1,
                        class2:common.class2,
                        favicon:common.favicon
                    });
                } else {
                    res.send('Database Not connected');
                }
            });
        });
    });
});

router.get('/edit-post/:post_id', function(req, res, next) {
    if(req.user){
        var post_id = req.params.post_id;
        var sql2 = "SELECT * FROM `user_post` WHERE `id` = '"+post_id+"' AND `status` = 1 AND `is_approved` = 1";
        var sql3 = "SELECT * FROM `dimages` WHERE `posts_id` = '"+post_id+"'";
        var sql8 = "SELECT * FROM `logo` WHERE `website` = '"+ common.logo_path +"'";
        var sql = "SELECT * FROM `dcategory` WHERE `status` = 1";
        var sql4 = "SELECT * FROM `states` WHERE `country_id` = 101";
        mysqlconnection.query(sql8,function(err,logo){
            mysqlconnection.query(sql,function(err,dcategory){
                mysqlconnection.query(sql2,function(err,user_post){
                    mysqlconnection.query(sql3,function(err,post_images){
                        mysqlconnection.query(sql4,function(err,states){
                            if(dcategory != undefined){
                                res.render('screens/edit-post',{
                                    logo:logo,
                                    dcategory:dcategory,
                                    user_post:user_post,
                                    post_images:post_images,
                                    logged_in:1,
                                    states:states,
                                    title:common.title,
                                    imageReplacer:common.imageReplacer,
                                    website:common.website,
                                    appId:common.appId,
                                    class1:common.class1,
                                    class2:common.class2,
                                    favicon:common.favicon
                                });
                            } else {
                                res.send('Database Not connected');
                            }
                        });
                    });
                });
            });
        });
    } else {
        res.redirect('/login')
    }
});

router.post('/edit-post/:post_id', function(req, res, next) {
    var post_id = req.params.post_id;
    const {category_name,ad_title,description,price,phone_number,address,brand,year,fuel,transmission,km_driven,no_of_owners,type,property,bedroom,bathroom,furnishing,construction_status,listed_by,area,total_floors,floor_no,car_parking,company_role,facing,name,bachelors_allowed,salary_period,position_type,salary_from,salary_to,appliances,furniture,fashion,user_id,city} = req.body;
    if(req.files != null){
        var a = [];
        if(req.files.images[0] == undefined){
            a.push(req.files.images);
        }else {
            a = req.files.images;
        }
        var sql6 = "UPDATE `user_post` SET `category_name` = '"+category_name+"',`ad_title`='"+ad_title+"',`description`='"+description+"',`price`='"+price+"',`phone_number` = '"+phone_number+"',`address` = '"+address+"',`brand` = '"+brand+"',`year`= '"+year+"',`fuel` = '"+fuel+"',`transmission`= '"+transmission+"',`km_driven`= '"+km_driven+"',`no_of_owners`= '"+no_of_owners+"',`type` = '"+type+"',`property`='"+property+"',`bedroom` = '"+bedroom+"',`bathroom` = '"+bathroom+"',`furnishing` = '"+furnishing+"',`construction_status` = '"+construction_status+"',`listed_by` = '"+listed_by+"',`area` = '"+area+"',`total_floors` = '"+total_floors+"',`floor_no` = '"+floor_no+"',`car_parking` = '"+car_parking+"',`company_role`= '"+company_role+"',`facing` = '"+facing+"',`name` = '"+name+"',`bachelors_allowed` = '"+bachelors_allowed+"',`salary_period` = '"+salary_period+"',`position_type` = '"+position_type+"',`salary_from` ='"+salary_from+"',`salary_to` = '"+salary_to+"',`appliances`= '"+appliances+"',`furniture` = '"+furniture+"',`fashion`='"+fashion+"',`user_id`='"+user_id+"',`city`='"+city+"',`website` = '"+common.website+"' WHERE `id` = '"+post_id+"'";
        mysqlconnection.query(sql6,function(err,data){
            if(!err){
                for(var i = 0 ;i<a.length;i++){
                    var Images = a[i];
                    var imageFiles = typeof (a)[i].name !=="undefined" ? (a)[i].name : "" ;
                    fs.mkdirp('public/directory_images/'+post_id , function(err){
                        if(err){
                            return console.log(err);
                        }
                    });
                    fs.mkdirp('public/directory_images/'+post_id+'/gallery', function(err){
                        if(err){
                            return console.log(err);
                        }
                    });

                    fs.mkdirp('public/directory_images/'+post_id+'/gallery/thumbs', function(err){
                        if(err){
                            return console.log(err);
                        }
                    });
                    var path1 = 'public/directory_images/' +post_id +'/'+ imageFiles;
                    Images.mv(path1, function(err){
                        if(err){
                            return console.log(err);
                        }
                    });
                    var sql = "INSERT INTO `dimages` (`path`,`posts_id`) VALUES ('" + imageFiles + "','" + post_id + "')";
                    mysqlconnection.query(sql,function(err,img){
                    });
                }
                res.redirect('/user-profile');
            }
        });
    } else {
        var sql6 = "UPDATE `user_post` SET `category_name` = '"+category_name+"',`ad_title`='"+ad_title+"',`description`='"+description+"',`price`='"+price+"',`phone_number` = '"+phone_number+"',`address` = '"+address+"',`brand` = '"+brand+"',`year`= '"+year+"',`fuel` = '"+fuel+"',`transmission`= '"+transmission+"',`km_driven`= '"+km_driven+"',`no_of_owners`= '"+no_of_owners+"',`type` = '"+type+"',`property`='"+property+"',`bedroom` = '"+bedroom+"',`bathroom` = '"+bathroom+"',`furnishing` = '"+furnishing+"',`construction_status` = '"+construction_status+"',`listed_by` = '"+listed_by+"',`area` = '"+area+"',`total_floors` = '"+total_floors+"',`floor_no` = '"+floor_no+"',`car_parking` = '"+car_parking+"',`company_role`= '"+company_role+"',`facing` = '"+facing+"',`name` = '"+name+"',`bachelors_allowed` = '"+bachelors_allowed+"',`salary_period` = '"+salary_period+"',`position_type` = '"+position_type+"',`salary_from` ='"+salary_from+"',`salary_to` = '"+salary_to+"',`appliances`= '"+appliances+"',`furniture` = '"+furniture+"',`fashion`='"+fashion+"',`user_id`='"+user_id+"',`city`='"+city+"',`website` = '"+ common.website +"' WHERE `id` = '"+post_id+"'";
        mysqlconnection.query(sql6,function(err,data){
            res.redirect('/user-profile');
        });
    }
});

router.get('/each-post/:post_id', function(req, res, next) {
    var post_id = req.params.post_id;
    var sql2 = "SELECT * FROM `user_post` WHERE `id` = '"+post_id+"' AND `status` = 1 AND `is_approved` = 1";
    var sql3 = "SELECT * FROM `dimages` WHERE `posts_id` = '"+post_id+"'";
    var sql8 = "SELECT * FROM `logo` WHERE `website` = '"+ common.logo_path +"'";
    var sql = "SELECT * FROM `dcategory` WHERE `status` = 1";
    mysqlconnection.query(sql8,function(err,logo){
        mysqlconnection.query(sql,function(err,dcategory){
            mysqlconnection.query(sql2,function(err,user_post){
                mysqlconnection.query(sql3,function(err,post_images){
                    if(dcategory != undefined){
                        res.render('screens/each-post',{
                            logo:logo,
                            dcategory:dcategory,
                            user_post:user_post,
                            post_images:post_images,
                            title:common.title,
                            imageReplacer:common.imageReplacer,
                            website:common.website,
                            appId:common.appId,
                            class1:common.class1,
                            class2:common.class2,
                            favicon:common.favicon
                        });
                    } else {
                        res.send('Database Not connected');
                    }
                });
            });
        });
    });
});

router.get('/posts/:category_name', function(req, res, next) {
    if(req.user){
        var logged_in = 1;
        var user_id = req.user.user_id;
        var category_name = req.params.category_name;
        var sql1 = "SELECT * FROM `dcategory` WHERE `status` = 1";
        var sql2 = "SELECT * FROM `form_fields` WHERE `category_name` = '"+category_name+"'";
        var sql8 = "SELECT * FROM `logo` WHERE `website` = '"+ common.logo_path +"'";
        var sql3 = "SELECT * FROM `states` WHERE `country_id` = 101";
        mysqlconnection.query(sql2,function(err,forms){
            mysqlconnection.query(sql1,function(err,categories){
                mysqlconnection.query(sql8,function(err,logo){
                    mysqlconnection.query(sql3,function(err,states){
                        // console.log(forms);
                        if(forms != undefined){
                            res.render('screens/posts',{
                                forms:forms,
                                categories:categories,
                                logged_in:0,
                                logo:logo,
                                category_name:category_name,
                                states:states,
                                logged_in:logged_in,
                                user_id:user_id,
                                title:common.title,
                                imageReplacer:common.imageReplacer,
                                website:common.website,
                                appId:common.appId,
                                class1:common.class1,
                                class2:common.class2,
                                favicon:common.favicon
                            });
                        } else {
                            res.send('Database Not connected');
                        }
                    });
                });
            });
        });
    } else {
        res.redirect('/login');
    }
});

router.post('/submit-form', function(req, res, next) {
    const {category_name,ad_title,description,price,phone_number,address,brand,year,fuel,transmission,km_driven,no_of_owners,type,property,bedroom,bathroom,furnishing,construction_status,listed_by,area,total_floors,floor_no,car_parking,company_role,facing,name,bachelors_allowed,salary_period,position_type,salary_from,salary_to,appliances,furniture,fashion,user_id,city} = req.body;
    // console.log(category_name);
    // console.log(ad_title);
    // console.log(price);
    // console.log(phone_number);
    // console.log(address);
    if(req.files != null){
        var a = [];
        if(req.files.images[0] == undefined){
            a.push(req.files.images);
        }else {
            a = req.files.images;
        }
        var sql6 = "INSERT INTO `user_post` (`category_name`,`ad_title`,`description`,`price`,`phone_number`,`address`,`brand`,`year`,`fuel`,`transmission`,`km_driven`,`no_of_owners`,`type`,`property`,`bedroom`,`bathroom`,`furnishing`,`construction_status`,`listed_by`,`area`,`total_floors`,`floor_no`,`car_parking`,`company_role`,`facing`,`name`,`bachelors_allowed`,`salary_period`,`position_type`,`salary_from`,`salary_to`,`appliances`,`furniture`,`fashion`,`user_id`,`city`,`created_at`,`website`) VALUES ('"+category_name+"','"+ad_title+"','"+description+"','"+price+"','"+phone_number+"','"+address+"','"+brand+"','"+year+"','"+fuel+"','"+transmission+"','"+km_driven+"','"+no_of_owners+"','"+type+"','"+property+"','"+bedroom+"','"+bathroom+"','"+furnishing+"','"+construction_status+"','"+listed_by+"','"+area+"','"+total_floors+"','"+floor_no+"','"+car_parking+"','"+company_role+"','"+facing+"','"+name+"','"+bachelors_allowed+"','"+salary_period+"','"+position_type+"','"+salary_from+"','"+salary_to+"','"+appliances+"','"+furniture+"','"+fashion+"','"+user_id+"','"+city+"',CURRENT_TIMESTAMP,'"+common.website+"')";
        // console.log(sql6);
        mysqlconnection.query(sql6,function(err,data){
            if(!err){
                for(var i = 0 ;i<a.length;i++){
                    var Images = a[i];
                    var imageFiles = typeof (a)[i].name !=="undefined" ? (a)[i].name : "" ;
                    fs.mkdirp('public/directory_images/'+data.insertId , function(err){
                        if(err){
                            return console.log(err);
                        }
                    });
                    fs.mkdirp('public/directory_images/'+data.insertId+'/gallery', function(err){
                        if(err){
                            return console.log(err);
                        }
                    });

                    fs.mkdirp('public/directory_images/'+data.insertId+'/gallery/thumbs', function(err){
                        if(err){
                            return console.log(err);
                        }
                    });
                    var path1 = 'public/directory_images/' +data.insertId +'/'+ imageFiles;
                    Images.mv(path1, function(err){
                        if(err){
                            return console.log(err);
                        }
                    });
                    var sql = "INSERT INTO `dimages` (`path`,`posts_id`) VALUES ('" + imageFiles + "','" + data.insertId + "')";
                    mysqlconnection.query(sql,function(err,img){
                    });
                }
                res.redirect('/directory');
            }
        });
    }
});

router.get('/privacy-policy', function(req, res, next) {
    res.render('screens/privacy-policy',{
        title:common.title,
        imageReplacer:common.imageReplacer,
        website:common.website,
        appId:common.appId,
        class1:common.class1,
        class2:common.class2,
        favicon:common.favicon
    });
});

router.post('/user_filter', function(req, res, next) {
    var city = req.body.city;
    var state = req.body.state;
    var district = req.body.district
    // console.log(city);
    // console.log(district);
    // var user_id = req.body.user_id;

    var userFilterState = [];
    var userFilterCity = [];
    var userFilterDistrict = [];
    if(district != undefined){
        if(typeof district == 'string') {
            userFilterDistrict.push(district)
        } else if(typeof district == 'object') {
            userFilterDistrict = district;
        }
    }

    if(city != undefined){
        if(typeof city == 'string') {
            userFilterCity.push(city)
        } else if(typeof city == 'object') {
            userFilterCity = city;
        }
    }

    if(state != undefined){
        if(typeof state == 'string') {
            userFilterState.push(state)
        } else if(typeof state == 'object') {
            userFilterState = state;
        }
    }

    var final_filter = [{
        state : userFilterState,
        city : userFilterCity,
        district:userFilterDistrict
    }]

    // console.log(final_filter);

    // if(user_filter != undefined) {
    //   if(typeof user_filter == 'string') {
    //     userFilter.push(user_filter)
    //   } else if(typeof user_filter == 'object') {
    //     userFilter = user_filter;
    //   }
    // }

    res.cookie('Updated User Filter With District1', final_filter,{maxAge:  365*24*60*60*1000});
    // console.log(typeof user_filter);

    // if(user_filter != undefined){
    //   var sql1 = "DELETE from `user_filter` WHERE `user_id`= '"+user_id+"'";
    //   mysqlconnection.query(sql1,function (err,){
    //   });
    //
    //   if(typeof user_filter == 'string') {
    //     var sql = "INSERT INTO `user_filter` (`user_id` ,`sub_category_name`) VALUES ('"+user_id+"','"+user_filter+"')";
    //     mysqlconnection.query(sql,function (err,data){
    //     });
    //   } else if(typeof user_filter == 'object') {
    //     for(var i = 0;i<user_filter.length;i++){
    //       var sql = "INSERT INTO `user_filter` (`user_id` ,`sub_category_name`) VALUES ('"+user_id+"','"+user_filter[i]+"')";
    //       mysqlconnection.query(sql,function (err,data){
    //       });
    //     }
    //   }
    // }
    res.redirect('/news');
});


router.get('/news', function(req, res, next) {
    // console.log(req.user_filter);
    if(req.user){
        var logged_in = 1;
        var user_id = req.user.user_id;
    } else {
        var logged_in = 0;
        var user_id = undefined;
    }
    // var lastImpNews = "SELECT `created_at` FROM `news` WHERE `is_approved` = 1 AND `status` = 1 AND `imp` = 1 ORDER By `news_id` DESC LIMIT 1 OFFSET 0";
    var noStatesCategories = "SELECT * FROM `categories` WHERE `status` = 1 AND `name` <> 'NULL' AND `is_state` = 0 ORDER BY `order`";
    var StatesCategories = "SELECT * FROM `categories` WHERE `status` = 1 AND `name` <> 'NULL' AND `is_state` = 1 ORDER BY `order`";
    var sub_category = "SELECT `sub-categories`.* FROM `sub-categories` INNER JOIN `categories` ON `categories`.`id` = `sub-categories`.`category_id` WHERE `sub-categories`.`status` = 1 AND `sub-categories`.`name` <> 'NULL' AND `sub-categories`.`name` NOT LIKE '%(%' AND `categories`.`is_state` = 1 ORDER BY `sub-categories`.`name`";
    var sub_category_district = "SELECT `sub-categories`.* FROM `sub-categories` INNER JOIN `categories` ON `categories`.`id` = `sub-categories`.`category_id` WHERE `sub-categories`.`status` = 1 AND `sub-categories`.`name` <> 'NULL' AND `sub-categories`.`name` LIKE '%(%' AND `categories`.`is_state` = 1 ORDER BY `sub-categories`.`name`";
    var sql2 = "SELECT * FROM `slider` WHERE `status` = 1  AND category = 'main' ORDER BY `order`";
    var sql8 = "SELECT * FROM `logo` WHERE `website` = '"+ common.logo_path +"'";
    var sql = "SELECT `news`.*,`categories`.`name` AS c_name,`categories`.`headingColor` AS hcolor,`sub-categories`.`name` AS sc_name, `users`.`nickname` AS u_name FROM `news` INNER JOIN `categories` ON `categories`.`id` = `news`.`category_id` INNER JOIN `sub-categories` ON `sub-categories`.`id` =`news`.`sub_category_id` INNER JOIN `users` ON `users`.`user_id` =`news`.`user_id` WHERE `news`.`is_approved` = 1 AND `news`.`status` = 1 AND `categories`.`status` = 1 ORDER By `news`.`news_id` DESC LIMIT 10 OFFSET 0";
    var sql3 = "SELECT `news_id`,`short_description` FROM `news` WHERE `is_approved` = 1 AND `status` = 1 AND `imp` = 1 ORDER By `news_id` DESC LIMIT 10 OFFSET 0";
    mysqlconnection.query(noStatesCategories,function(err,noStatesCategories){
        mysqlconnection.query(sql2,function(err,slider){
            mysqlconnection.query(sql3,function(err,news){
                mysqlconnection.query(sql8,function(err,logo){
                    mysqlconnection.query(sub_category,function(err,subCategories){
                        mysqlconnection.query(sub_category_district,function(err,subCategoriesDistrict){
                            mysqlconnection.query(StatesCategories,function(err,StatesCategories){
                                mysqlconnection.query(sql,function(err,news2){
                                    if(noStatesCategories != undefined){
                                        res.render('screens/news',{
                                            categories:noStatesCategories,
                                            StatesCategories:StatesCategories,
                                            slider:slider,
                                            news:news,
                                            news2:news2,
                                            logo:logo,
                                            subCategories:subCategories,
                                            user_filter:req.user_filter,
                                            logged_in:logged_in,
                                            user_id:user_id,
                                            title:common.title,
                                            imageReplacer:common.imageReplacer,
                                            website:common.website,
                                            appId:common.appId,
                                            class1:common.class1,
                                            class2:common.class2,
                                            favicon:common.favicon,
                                            subCategoriesDistrict:subCategoriesDistrict
                                        });
                                    } else {
                                        res.send('Database Not connected');
                                    }
                                });
                            });
                        });
                    });
                });
            });
        });
    });
    // var sql = "SELECT * FROM `user_filter` WHERE `user_id` = '" + req.user.user_id + "'";
    // mysqlconnection.query(lastImpNews,function(err,lastImpNews){
    //     if(lastImpNews != undefined){
    //         // if(lastImpNews.length != 0){
    //             // console.log(lastImpNews);
    //             // var date = new Date(lastImpNews[0].created_at);
    //             // var date_iso = date.toISOString().split('T')[0];
    //             // var yesterday1 = new Date(date);
    //             // yesterday1.setDate(yesterday1.getDate()-2);
    //             // var yesterday_iso = yesterday1.toISOString().split('T')[0];
    //             // var sql3 = "SELECT `news_id`,`short_description` FROM `news` WHERE `is_approved` = 1 AND `status` = 1 AND `imp` = 1 AND (`created_at` BETWEEN '"+yesterday_iso+"' AND '"+date_iso+"') ORDER By `news_id` DESC";
    //         // }
    //         // else {
    //
    //     } else {
    //         res.send('Database Not connected');
    //     }
    // });
});

router.get('/getAllNews/:category_id', function(req, res, next) {
    var category_id = req.params.category_id;
    if(category_id == "all"){
        var sql = "SELECT `news`.*,`categories`.`name` AS c_name,`categories`.`headingColor` AS hcolor,`sub-categories`.`name` AS sc_name, `users`.`nickname` AS u_name FROM `news` INNER JOIN `categories` ON `categories`.`id` = `news`.`category_id` INNER JOIN `sub-categories` ON `sub-categories`.`id` =`news`.`sub_category_id` INNER JOIN `users` ON `users`.`user_id` =`news`.`user_id` WHERE `news`.`is_approved` = 1 AND `news`.`status` = 1 AND `categories`.`status` = 1 ORDER By `news`.`news_id` DESC LIMIT 10 OFFSET 0";
    }else if(category_id == "local"){
        var sql = "SELECT `news`.*,`categories`.`name` AS c_name,`categories`.`headingColor` AS hcolor,`sub-categories`.`name` AS sc_name, `users`.`nickname` AS u_name FROM `news` INNER JOIN `categories` ON `categories`.`id` = `news`.`category_id` INNER JOIN `sub-categories` ON `sub-categories`.`id` =`news`.`sub_category_id` INNER JOIN `users` ON `users`.`user_id` =`news`.`user_id` WHERE `news`.`is_approved` = 1 AND `news`.`status` = 1 AND `categories`.`status` = 1 AND `categories`.`is_state` = 1 ORDER By `news`.`news_id` DESC LIMIT 10 OFFSET 0";
    }else {
        var sql = "SELECT `news`.*,`categories`.`name` AS c_name,`categories`.`headingColor` AS hcolor,`sub-categories`.`name` AS sc_name, `users`.`nickname` AS u_name FROM `news` INNER JOIN `categories` ON `categories`.`id` = `news`.`category_id` INNER JOIN `sub-categories` ON `sub-categories`.`id` =`news`.`sub_category_id` INNER JOIN `users` ON `users`.`user_id` =`news`.`user_id` WHERE `news`.`is_approved` = 1 AND `news`.`status` = 1 AND `categories`.`name` = '"+ category_id +"' AND `categories`.`status` = 1 ORDER By `news`.`news_id` DESC LIMIT 10 OFFSET 0";
    }
    mysqlconnection.query(sql,function(err,news){
        res.jsonp(news);
    });
});


router.get('/getAllNews/:category_id/:offset', function(req, res, next) {
    var category_id = req.params.category_id;
    // console.log(category_id);
    var o = req.params.offset;
    if(category_id == 'all') {
        var sql = "SELECT `news`.*,`categories`.`name` AS c_name,`categories`.`headingColor` AS hcolor,`sub-categories`.`name` AS sc_name, `users`.`nickname` AS u_name FROM `news` INNER JOIN `categories` ON `categories`.`id` = `news`.`category_id` INNER JOIN `sub-categories` ON `sub-categories`.`id` =`news`.`sub_category_id` INNER JOIN `users` ON `users`.`user_id` =`news`.`user_id` WHERE `news`.`is_approved` = 1 AND `news`.`status` = 1 ORDER By `news`.`news_id` DESC LIMIT 10 OFFSET " + o + "";
    }else if(category_id == 'local'){
        var sql = "SELECT `news`.*,`categories`.`name` AS c_name,`categories`.`headingColor` AS hcolor,`sub-categories`.`name` AS sc_name, `users`.`nickname` AS u_name FROM `news` INNER JOIN `categories` ON `categories`.`id` = `news`.`category_id` INNER JOIN `sub-categories` ON `sub-categories`.`id` =`news`.`sub_category_id` INNER JOIN `users` ON `users`.`user_id` =`news`.`user_id` WHERE `news`.`is_approved` = 1 AND `news`.`status` = 1 AND `categories`.`status` = 1 AND `categories`.`is_state` = 1 ORDER By `news`.`news_id` DESC LIMIT 10 OFFSET " + o + "";
    } else {
        var sql = "SELECT `news`.*,`categories`.`name` AS c_name,`categories`.`headingColor` AS hcolor,`sub-categories`.`name` AS sc_name, `users`.`nickname` AS u_name FROM `news` INNER JOIN `categories` ON `categories`.`id` = `news`.`category_id` INNER JOIN `sub-categories` ON `sub-categories`.`id` =`news`.`sub_category_id` INNER JOIN `users` ON `users`.`user_id` =`news`.`user_id` WHERE `news`.`is_approved` = 1 AND `news`.`status` = 1 AND `news`.`category_id` = '"+ category_id +"' AND `categories`.`status` = 1 ORDER By `news`.`news_id` DESC LIMIT 10 OFFSET "+o+"";
    }
    // console.log(sql);
    mysqlconnection.query(sql,function(err,news){
        res.jsonp(news);
    });
});

router.get('/getSubCategoryNewsState/:sub_category_name', function(req, res, next) {
    var sub_category_name = req.params.sub_category_name;
    var sql = "SELECT `news`.*,`categories`.`name` AS c_name,`categories`.`headingColor` AS hcolor,`sub-categories`.`name` AS sc_name, `users`.`nickname` AS u_name FROM `news` INNER JOIN `categories` ON `categories`.`id` = `news`.`category_id` INNER JOIN `sub-categories` ON `sub-categories`.`id` =`news`.`sub_category_id` INNER JOIN `users` ON `users`.`user_id` =`news`.`user_id` WHERE `news`.`is_approved` = 1 AND `news`.`status` = 1 AND `categories`.`name` = '"+ sub_category_name +"' AND `sub-categories`.`status` = 1 ORDER By `news`.`news_id` DESC LIMIT 10 OFFSET 0";
    // console.log(sql);
    mysqlconnection.query(sql,function(err,news){
        res.jsonp(news);
    });
});

router.get('/getSubCategoryNewsState/:sub_category_name/:offset', function(req, res, next) {
    var sub_category_name = req.params.sub_category_name;
    var o = req.params.offset;
    var sql = "SELECT `news`.*,`categories`.`name` AS c_name,`categories`.`headingColor` AS hcolor,`sub-categories`.`name` AS sc_name, `users`.`nickname` AS u_name FROM `news` INNER JOIN `categories` ON `categories`.`id` = `news`.`category_id` INNER JOIN `sub-categories` ON `sub-categories`.`id` =`news`.`sub_category_id` INNER JOIN `users` ON `users`.`user_id` =`news`.`user_id` WHERE `news`.`is_approved` = 1 AND `news`.`status` = 1 AND `categories`.`name` = '"+ sub_category_name +"' AND `sub-categories`.`status` = 1 ORDER By `news`.`news_id` DESC LIMIT 10 OFFSET "+o+"";
    mysqlconnection.query(sql,function(err,news){
        res.jsonp(news);
    });
});

router.get('/getSubCategoryNewsCity/:sub_category_name', function(req, res, next) {
    var sub_category_name = req.params.sub_category_name;
    // console.log(sub_category_name);
    var sql = "SELECT `news`.*,`categories`.`name` AS c_name,`categories`.`headingColor` AS hcolor,`sub-categories`.`name` AS sc_name, `users`.`nickname` AS u_name FROM `news` INNER JOIN `categories` ON `categories`.`id` = `news`.`category_id` INNER JOIN `sub-categories` ON `sub-categories`.`id` =`news`.`sub_category_id` INNER JOIN `users` ON `users`.`user_id` =`news`.`user_id` WHERE `news`.`is_approved` = 1 AND `news`.`status` = 1 AND `sub-categories`.`name` LIKE '"+ ('%' + sub_category_name + '%') +"' AND `sub-categories`.`status` = 1 ORDER By `news`.`news_id` DESC LIMIT 10 OFFSET 0";
    // console.log(sql);
    mysqlconnection.query(sql,function(err,news){
        // console.log(news);
        res.jsonp(news);
    });
});

router.get('/getFilterCity/:category_name', function(req, res, next) {
    var category_name = req.params.category_name;
    // console.log(sub_category_name);
    var sql = "SELECT `sub-categories`.`name` FROM `sub-categories` INNER JOIN `categories` ON `categories`.`id` = `sub-categories`.`category_id` WHERE `sub-categories`.`status` = 1 AND `categories`.`name` = '"+ category_name +"' AND `sub-categories`.`name` NOT LIKE '%(%'";
    // console.log(sql);
    mysqlconnection.query(sql,function(err,news){
        // console.log(news);
        res.jsonp(news);
    });
});

router.get('/getFilterDistrict/:category_name', function(req, res, next) {
    var category_name = req.params.category_name;
    // console.log(category_name);
    var sql = "SELECT `name` FROM `sub-categories` WHERE `name` LIKE '"+ ('%' +  category_name + '%') +"' AND status = 1 AND `name` <> '"+  category_name +"'";
    // console.log(sql);
    mysqlconnection.query(sql,function(err,news){
        // console.log(news);
        res.jsonp(news);
    });
});

router.get('/getSubCategoryNewsCity/:sub_category_name/:offset', function(req, res, next) {
    var sub_category_name = req.params.sub_category_name;
    var o = req.params.offset;
    var sql = "SELECT `news`.*,`categories`.`name` AS c_name,`categories`.`headingColor` AS hcolor,`sub-categories`.`name` AS sc_name, `users`.`nickname` AS u_name FROM `news` INNER JOIN `categories` ON `categories`.`id` = `news`.`category_id` INNER JOIN `sub-categories` ON `sub-categories`.`id` =`news`.`sub_category_id` INNER JOIN `users` ON `users`.`user_id` =`news`.`user_id` WHERE `news`.`is_approved` = 1 AND `news`.`status` = 1 AND `sub-categories`.`name` LIKE '"+ ('%' + sub_category_name + '%') +"' AND `sub-categories`.`status` = 1 ORDER By `news`.`news_id` DESC LIMIT 10 OFFSET "+o+"";
    mysqlconnection.query(sql,function(err,news){
        res.jsonp(news);
    });
});


router.get('/login', function(req, res, next) {
    if(req.user){
        res.redirect('/news');
    } else {
        var sql8 = "SELECT * FROM `logo` WHERE `website` = '"+ common.logo_path +"'";
        var sql1 = "SELECT * FROM `states` WHERE `country_id` = 101";
        mysqlconnection.query(sql8,function(err,logo){
            mysqlconnection.query(sql1,function(err,states){
                if(logo != undefined){
                    res.render('screens/user-login',{
                        logo:logo,
                        states:states,
                        title:common.title,
                        imageReplacer:common.imageReplacer,
                        website:common.website,
                        appId:common.appId,
                        class1:common.class1,
                        class2:common.class2,
                        favicon:common.favicon
                    });
                } else {
                    res.send('Database Not connected');
                }
            });
        });
    }
});

router.get('/logout', function(req, res, next) {
    res.clearCookie('AuthToken');
    res.redirect('/login');
});


router.get('/user-login/:phone/:tokken/:full_name/:city', function(req, res, next) {
    var phone = req.params.phone;
    var tokken = req.params.tokken;
    var full_name = req.params.full_name;
    var city = req.params.city;
    var is_approved = 1;
    var user_data;
    var sql = "SELECT * FROM `users` WHERE phone = '" + phone + "' AND status = 1 AND role_id = 4 AND password = '" + tokken + "'";
    mysqlconnection.query(sql,function(err,data){
        if(data.length != 0){
            var sql7 = "UPDATE `users` SET `full_name` = '" + full_name + "',`city` = '"+city+"' WHERE phone = '" + phone + "' AND status = 1 AND role_id = 4 AND password = '" + tokken + "'";
            mysqlconnection.query(sql7,function(err,users1){
                // console.log(users1);
            });
            user_data = {
                full_name:full_name,
                password:tokken,
                phone:phone,
                city:city,
                user_id:data[0].user_id
            }
            const authToken = generateAuthToken();
            // Store authentication token
            authTokens[authToken] = user_data;

            // Setting the auth token in cookies
            res.cookie('AuthToken', authToken,{maxAge:  365*24*60*60*1000});
            res.redirect('/news');
        }else {
            var sql6 = "INSERT INTO `users` (`full_name`,`password`,`is_approved`,`phone`,`role_id`,`city`) VALUES ('" + full_name + "','" + tokken + "','" + is_approved + "','" + phone + "',4,'"+city+"')";
            mysqlconnection.query(sql6,function(err,users){
                if(!err){
                    user_data = {
                        full_name:full_name,
                        password:tokken,
                        phone:phone,
                        city:city,
                        user_id:users.insertId
                    }
                    const authToken = generateAuthToken();
                    // Store authentication token
                    authTokens[authToken] = user_data;

                    // Setting the auth token in cookies
                    res.cookie('AuthToken', authToken,{maxAge:  365*24*60*60*1000});
                    res.redirect('/news');
                }
            });
        }
    });
});

router.get('/getCity/:name', function(req, res, next) {
    var name = req.params.name;
    var sql1 = "SELECT * FROM `states` WHERE name = '" + name + "'";
    mysqlconnection.query(sql1,function(err,states){
        var sql = "SELECT * FROM `cities` WHERE state_id = '" + states[0].id + "'";
        mysqlconnection.query(sql,function(err,data){
            res.jsonp(data);
        });
    });
});

module.exports = router;
