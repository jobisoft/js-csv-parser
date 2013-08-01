describe("CSVParser", function() {
  var parser, data, fieldSeparator, rowSeparator;
  describe("separators", function(){
    beforeEach(function(){
      data = 'url,username,password,extra,name,grouping,fav\nhttps://www.example.com,myUsername,"abcdé\"4j+<+G9\n3$6,6,+z:(b?g\\",,example.com,,1';
      parser = new CSVParser(data);
    });

    it("uses comma as the default field separator", function(){
      expect(parser.fieldSeparator).toEqual(",");
    });

    it("uses newline as the default row separator", function(){
      parser = new CSVParser(data);
      expect(parser.rowSeparator).toEqual("\n");
    });
    it("accepts a custom field separator", function(){
      parser = new CSVParser(data, "|");
      expect(parser.fieldSeparator).toEqual("|");
    });
    it("accepts a custom row separator", function(){
      parser = new CSVParser(data, ",", "|");
      expect(parser.rowSeparator).toEqual("|");
    });
  });

  describe("parsing", function(){
    describe("basic", function(){
      it("parses rows with default separators", function(){
        data = 'url,username,password,extra,name,grouping,fav\nhttps://www.example.com,myUsername,mypassword,,example.com,,1';
        parser = new CSVParser(data);
        parser.parse();
        expect(parser.numberOfRows()).toEqual(2);
      });
      it("parses rows with custom row separator", function(){
        data = 'url,username,password,extra,name,grouping,fav|https://www.example.com,myUsername,mypassword,,example.com,,1';
        parser = new CSVParser(data, ",", "|");
        parser.parse();
        expect(parser.numberOfRows()).toEqual(2);
      });
      it("parses rows with custom field separator", function(){
        data = 'url|username|password|extra|name|grouping|fav\nhttps://www.example.com|myUsername|mypassword||example.com||1';
        parser = new CSVParser(data, "|");
        parser.parse();
        expect(parser.numberOfRows()).toEqual(2);
      });
    });
    describe("advanced", function(){
      it("handles rows with quoted fields", function(){
        data = '"url","username","password","extra","name","grouping","fav"\n"https://www.example.com","myUsername","mypassword","","example.com","","1"';
        parser = new CSVParser(data);
        parser.parse();
        expect(parser.rows[0][0]).toEqual("url");
      });
      it("handles fields with newlines", function(){
        data = '"url","user\nname","password","extra","name","grouping","fav"\n"https://www.example.com","myUsername","mypassword","","example.com","","1"';
        parser = new CSVParser(data);
        parser.parse();
        expect(parser.rows[0][1]).toEqual("user\nname");
      });
      it("handles fields with escaped double quotes", function(){
        data = '"url","user\nname","password","extra","name","grouping","fav"\n"https://www.example.com","myUsername","mypassword","","\"example.com\"","","1"';
        parser = new CSVParser(data);
        parser.parse();
        expect(parser.rows[1][4]).toEqual('"example.com"');
      });
      it("handles fields with escaped backslashes", function(){
        data = '"url","user\nname","password","extra","name","grouping","fav"\n"https://www.example.com","myUsername","mypassword","",\\\\example.com\\\\","","1"';
        parser = new CSVParser(data);
        parser.parse();
        expect(parser.rows[1][4]).toEqual('\\example.com\\');
      });
      it("handles fields with tricky backslashes", function(){
        data = '"url","user\nname","password","extra","name","grouping","fav"\n"https://www.example.com","myUsername","mypassword","","\\"example.com\\\\","","1"';
        parser = new CSVParser(data);
        parser.parse();
        expect(parser.rows[1][4]).toEqual('"example.com\\');
      });
    });
  });

});