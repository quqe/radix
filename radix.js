'use strict';

const	__getnode = 0,
		__getdata = 1,
		__delete = 2,
		__getpath = 3,
		__setdata = 4;

module.exports = class RadixT {
	data = ["",{}];
	
	constructor(d = null) {
		this.data[2] = d;
	}

	find(r, o, L = 0, I = 0, p = null) {
		var t = 0,
			l = r[0].length,k,c;
		while (t < l && I < L) {
			if (r[0][t] != o.s[I])
				break;
			t++;
			I++;
		}
		if (I == L) //main string much!
		{
			if (t == l) //substring much!
			{
				if (o.a == __setdata) //SET DATA?
				{
					//r.d = o.d;
					r[2]=o.d;
					return true;
				} else if (o.a == __delete) //DELETE DATA?
				{
					k = Object.keys(r[1]);
					if (k.length == 1) {
						r[0]+=r[1][k[0]][0];
						r[1]=r[1][k[0]][1];
						if(r[1][k[0]][2])
							r[2]=r[1][k[0]][2];
					} else if (k.length > 1)
						if(r.length==3)
							r.pop();//DELETE 
					else {
						delete p[1][r[0][0]];//CHECK IF r[0].length>0;
						//IF PARENT HAS ONLY ONE CHILD AND HAS NO DATA IT ALSO SHOULD BE DELETED
						// if(p.c.length==1 && p.d==null)
						// {
						// p.v+=p.c[0]
						// }
					}
					return true;
				} else {
					if (o.a == __getdata)
						return r[2];
					else if(o.a == __getnode)
						return r;
					else if(o.a == __getpath)
						return [L-t, r];
				}
			} else {//much main string but substring longer 
				if (o.a == __setdata) {
					r[1][r[0][t]] = [r[0].substring(t),{}];
					if(r.length==3)
						r[1][r[0][t]].push(r[2]);
					r[0]=o.s.substring(L - t);
					r[2]=o.d;
					return true;
				} else if (o.a == __getpath) //GET BRUNCH!
					return [L-t, r];
				else
					return null; //NO DATA TO RETURN, NO SUCH NODE
			}
		} else //STILL have main string part
		{
			if (t == l) //SUBSTRING complete
			{
				if(r[1][o.s[I]])//IS THERE CHILD WITH convinient start string
					return this.find(r[1][o.s[I]], o, L, I, r);
				else {
					if (o.a == __setdata) //SET DATA
					{
						r[1][o.s[I]]=[o.s.substring(I),{},o.d];
						return true;
					} else
						return null;
				}
			} else //main and substrings are different
			{
				if (o.a == __setdata) //set or append new value?
				{
					c = r[1];
					r[1]={};
					r[1][r[0][t]] = [r[0].substring(t),c];
					if(r[2])
						r[1][r[0][t]].push(r[2]);
					r[0] = r[0].substring(0, t);
					if(r.length==3)
						r.pop();
					r[1][o.s[I]] = [o.s.substring(I),{},o.d];
				} else
					return null;
			}
		}
	}
	get(name) //GET DATA
	{
		return this.find(this.data, {
			s: name,
			a: __getdata
		}, name.length);
	}
	getn(name) {
		return this.find(this.data, {
			s: name,
			a: __getnode
		}, name.length);
	}
	del(name) //DELETE DATA
	{
		return this.find(this.data, {
			s: name,
			a: __delete
		}, name.length);
	}
	set(name, value) //SET DATA
	{
		return this.find(this.data, {
			s: name,
			a: __setdata,
			d: value
		}, name.length);
	}
	getdata() {
		return this.data;
	}
	setdata(d) {
		if (d)
			this.data = d;
	}
	getnodes(v, n, callback) {
		if(n[2])
			callback(v+n[0], n[2]);
		Object.keys(n[1]).forEach(k => {
			this.getnodes(v+n[0], n[1][k], callback);
		});
	}
	getpath(n) {}
	forEach(basepath, callback = null) {
		var n;
		if (callback != null) {
			if ((n = this.find(this.data, {
						s: basepath,
						a: __getpath
					}, basepath.length)) != null)
				this.getnodes(basepath.substring(0, n[0]), n[1], callback);
		} else
			this.getnodes("", this.data, basepath);
	}
};